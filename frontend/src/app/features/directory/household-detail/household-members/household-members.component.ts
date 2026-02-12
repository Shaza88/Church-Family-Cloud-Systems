import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HouseholdStore } from '../../../../core/store/household.store';
import { LookupStore } from '../../../../core/store/lookup.store';
import { Household, Individual } from '../../../../core/models/household.model';

@Component({
  selector: 'app-household-members',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatDividerModule,
  ],
  templateUrl: './household-members.component.html',
})
export class HouseholdMembersComponent implements OnInit {
  store = inject(HouseholdStore);
  lookupStore = inject(LookupStore);
  fb = inject(FormBuilder);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      primary: this.createMemberForm('Head'),
      hasSpouse: [false],
      spouse: this.createMemberForm('Spouse'),
      minors: this.fb.array([]),
      others: this.fb.array([]),
    });

    // Watch for spouse checkbox changes
    this.form.get('hasSpouse')?.valueChanges.subscribe((hasSpouse) => {
      const spouseControl = this.form.get('spouse');
      if (hasSpouse) {
        spouseControl?.enable();
      } else {
        spouseControl?.disable();
      }
    });

    effect(() => {
      const household = this.store.selectedHousehold();
      if (household) {
        this.patchForm(household);
      } else {
        // Reset to default state
        this.form.reset();
        this.minorsArray.clear();
        this.othersArray.clear();
        this.form.get('hasSpouse')?.setValue(false);
        this.form.get('spouse')?.disable();
      }
    });
  }

  get minorsArray() {
    return this.form.get('minors') as FormArray;
  }

  get othersArray() {
    return this.form.get('others') as FormArray;
  }

  ngOnInit() {
    // Ensure spouse is disabled initially if unchecked
    if (!this.form.get('hasSpouse')?.value) {
      this.form.get('spouse')?.disable();
    }
  }

  createMemberForm(role: string): FormGroup {
    return this.fb.group({
      id: [crypto.randomUUID()],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: [
        role === 'Head' || role === 'Spouse' || role === 'Child' ? '' : '',
        role !== 'Child' ? Validators.required : null,
      ], // Last name required for non-children, optional logic can be refined
      role: [role],
      gender: ['', Validators.required],
      dateOfBirth: [null],
      email: ['', role === 'Head' ? [Validators.email] : [Validators.email]], // Email optional but valid
      phone: [''],
      profession: [''],
      relationship: [role === 'Other' ? '' : '', role === 'Other' ? Validators.required : null],
    });
  }

  addMinor() {
    this.minorsArray.push(this.createMemberForm('Child'));
  }

  removeMinor(index: number) {
    this.minorsArray.removeAt(index);
  }

  addOther() {
    this.othersArray.push(this.createMemberForm('Other'));
  }

  removeOther(index: number) {
    this.othersArray.removeAt(index);
  }

  patchForm(household: Household) {
    // 1. Primary
    const primary = household.members.find((m) => m.role === 'Head');
    if (primary) {
      this.form.get('primary')?.patchValue(primary);
    }

    // 2. Spouse
    const spouse = household.members.find((m) => m.role === 'Spouse');
    if (spouse) {
      this.form.get('hasSpouse')?.setValue(true);
      this.form.get('spouse')?.enable();
      this.form.get('spouse')?.patchValue(spouse);
    } else {
      this.form.get('hasSpouse')?.setValue(false);
      this.form.get('spouse')?.disable();
      this.form.get('spouse')?.reset(this.createMemberForm('Spouse').value); // Reset values but keep structure
    }

    // 3. Minors
    this.minorsArray.clear();
    const minors = household.members.filter((m) => m.role === 'Child');
    minors.forEach((m) => {
      const group = this.createMemberForm('Child');
      group.patchValue(m);
      this.minorsArray.push(group);
    });

    // 4. Others
    this.othersArray.clear();
    const others = household.members.filter((m) => m.role === 'Other');
    others.forEach((m) => {
      const group = this.createMemberForm('Other');
      group.patchValue(m);
      this.othersArray.push(group);
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const household = this.store.selectedHousehold();

    // Reconstruct members array
    const members: Individual[] = [];

    // Add Primary
    members.push({ ...formValue.primary, role: 'Head' });

    // Add Spouse
    if (formValue.hasSpouse) {
      members.push({ ...formValue.spouse, role: 'Spouse' });
    }

    // Add Minors
    formValue.minors.forEach((m: any) => members.push({ ...m, role: 'Child' }));

    // Add Others
    formValue.others.forEach((m: any) => members.push({ ...m, role: 'Other' }));

    const updatedHousehold: Household = {
      ...(household || ({} as Household)),
      id: household?.id || crypto.randomUUID(),
      name: household?.name || 'New Household', // Logic to update name based on Primary could be added here
      address: household?.address || { street1: '', city: '', state: '', zip: '' }, // Keep existing address
      status: household?.status || 'Active', // Keep existing status
      memberCount: members.length,
      members: members,
      phone: household?.phone,
    };

    // Update name if it's a new household or if we want to sync it with primary
    if (formValue.primary.lastName) {
      updatedHousehold.name = `${formValue.primary.lastName} Household`;
    }

    if (household) {
      this.store.updateHousehold(updatedHousehold);
    } else {
      this.store.addHousehold(updatedHousehold);
    }
  }
}
