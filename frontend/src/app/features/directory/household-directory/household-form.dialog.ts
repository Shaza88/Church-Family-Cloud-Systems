import { Component, inject, Inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Household, Individual } from '../../../core/models/household.model';
import { LookupStore } from '../../../core/store/lookup.store';
import { merge } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'cfcs-household-form-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDividerModule,
  ],
  templateUrl: './household-form.dialog.html',
})
export class HouseholdFormDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<HouseholdFormDialog>);
  private destroyRef = inject(DestroyRef);
  lookupStore = inject(LookupStore);

  form!: FormGroup;
  isEditMode = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Household | null) {
    this.isEditMode = !!data;
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const primary = this.data?.members.find((m) => m.role === 'Head');
    const spouse = this.data?.members.find((m) => m.role === 'Spouse');
    const minors = this.data?.members.filter((m) => m.role === 'Child') || [];

    this.form = this.fb.group({
      name: [this.data?.name || '', [Validators.required]],
      address: this.fb.group({
        street1: [this.data?.address.street1 || '', [Validators.required]],
        street2: [this.data?.address.street2 || ''],
        city: [this.data?.address.city || '', [Validators.required]],
        state: [this.data?.address.state || '', [Validators.required]],
        zip: [this.data?.address.zip || '', [Validators.required]],
      }),
      status: [this.data?.status || 'Active', [Validators.required]],

      // Primary Contact
      primary: this.fb.group({
        firstName: [primary?.firstName || '', [Validators.required]],
        middleName: [primary?.middleName || ''],
        lastName: [primary?.lastName || '', [Validators.required]],
        gender: [primary?.gender || '', [Validators.required]],
        dateOfBirth: [primary?.dateOfBirth || null],
        email: [primary?.email || '', [Validators.email]],
        phone: [primary?.phone || ''],
        profession: [primary?.profession || ''],
      }),

      // Spouse
      hasSpouse: [!!spouse],
      spouse: this.fb.group({
        firstName: [spouse?.firstName || '', [Validators.required]],
        middleName: [spouse?.middleName || ''],
        lastName: [spouse?.lastName || '', [Validators.required]],
        gender: [spouse?.gender || '', [Validators.required]],
        dateOfBirth: [spouse?.dateOfBirth || null],
        email: [spouse?.email || '', [Validators.email]],
        phone: [spouse?.phone || ''],
        profession: [spouse?.profession || ''],
      }),

      // Minors
      minors: this.fb.array([]),
    });

    // Auto-calculate Household Name
    // Listen to all relevant fields: Primary Last/First, Spouse First, Minors First
    merge(
      this.form.get('primary.lastName')!.valueChanges,
      this.form.get('primary.firstName')!.valueChanges,
      this.form.get('hasSpouse')!.valueChanges,
      this.form.get('spouse.firstName')!.valueChanges,
      this.minorsArray.valueChanges,
    )
      .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateHouseholdName();
      });

    // Handle Spouse Validation Logic
    this.form.get('hasSpouse')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((hasSpouse) => {
      const spouseGroup = this.form.get('spouse') as FormGroup;
      if (hasSpouse) {
        spouseGroup.enable();
      } else {
        spouseGroup.disable();
      }
      this.updateHouseholdName();
    });

    // Initialize Minors
    minors.forEach((m) => this.addMinor(m));

    // Initial state check for spouse
    if (!this.form.get('hasSpouse')?.value) {
      this.form.get('spouse')?.disable();
    }
  }

  updateHouseholdName() {
    // Ex: Atieyeh, Rami, Shaza, Ella & Liam
    const primaryLast = this.form.get('primary.lastName')?.value || '';
    const primaryFirst = this.form.get('primary.firstName')?.value || '';
    const hasSpouse = this.form.get('hasSpouse')?.value;
    const spouseFirst = this.form.get('spouse.firstName')?.value || '';

    const minors = this.minorsArray.value;
    const minorNames = minors.map((m: any) => m.firstName).filter((n: string) => !!n);

    if (!primaryLast) {
      this.form.get('name')?.setValue('');
      return;
    }

    let builtName = `${primaryLast}, ${primaryFirst}`;

    if (hasSpouse && spouseFirst) {
      builtName += `, ${spouseFirst}`;
    }

    if (minorNames.length > 0) {
      if (minorNames.length === 1) {
        builtName += ` & ${minorNames[0]}`;
      } else {
        const allButLast = minorNames.slice(0, -1).join(', ');
        const last = minorNames[minorNames.length - 1];
        builtName += `, ${allButLast} & ${last}`;
      }
    }

    this.form.get('name')?.setValue(builtName);
  }

  get minorsArray(): FormArray {
    return this.form.get('minors') as FormArray;
  }

  addMinor(data?: Individual) {
    const minorGroup = this.fb.group({
      firstName: [data?.firstName || '', [Validators.required]],
      middleName: [data?.middleName || ''],
      lastName: [data?.lastName || ''], // Optional, inherits
      email: [data?.email || '', [Validators.email]],
      // Hidden fields to satisfy model
      role: ['Child'],
      gender: [data?.gender || ''], // simplified for minor or add if needed
      dateOfBirth: [data?.dateOfBirth || null],
    });
    this.minorsArray.push(minorGroup);
  }

  removeMinor(index: number) {
    this.minorsArray.removeAt(index);
  }

  save() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const members: Individual[] = [];

      // Process Primary
      members.push({
        id: crypto.randomUUID(), // In real app, preserve ID
        role: 'Head',
        ...formValue.primary,
      });

      // Process Spouse
      if (formValue.hasSpouse) {
        members.push({
          id: crypto.randomUUID(),
          role: 'Spouse',
          ...formValue.spouse,
        });
      }

      // Process Minors
      formValue.minors.forEach((m: any) => {
        members.push({
          id: crypto.randomUUID(),
          role: 'Child',
          firstName: m.firstName,
          middleName: m.middleName,
          lastName: m.lastName, // Keep empty if not provided
          gender: m.gender || 'Male', // Default or add field
          dateOfBirth: m.dateOfBirth,
          email: m.email,
        });
      });

      const household: Household = {
        id: this.data?.id || crypto.randomUUID(),
        name: formValue.name,
        address: formValue.address, // Now structured
        status: formValue.status,
        members: members,
        memberCount: members.length,
      };
      // Auto-add professions if they are new
      const primaryProfession = formValue.primary.profession;
      if (primaryProfession) {
        this.lookupStore.addLookup('Profession', primaryProfession);
      }

      if (formValue.hasSpouse) {
        const spouseProfession = formValue.spouse.profession;
        if (spouseProfession) {
          this.lookupStore.addLookup('Profession', spouseProfession);
        }
      }

      this.dialogRef.close(household);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
