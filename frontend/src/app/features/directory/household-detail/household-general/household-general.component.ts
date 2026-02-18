import { Component, inject, input, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HouseholdStore } from '../../../../core/store/household.store';
import { LookupStore } from '../../../../core/store/lookup.store';
import { AuthStore } from '../../../../core/store/auth.store';
import { Household } from '../../../../core/models/household.model';
import { HasPermissionDirective } from '../../../../core/directives/has-permission.directive';

@Component({
  selector: 'app-household-general',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    HasPermissionDirective,
  ],
  templateUrl: './household-general.component.html',
})
export class HouseholdGeneralComponent implements OnInit {
  store = inject(HouseholdStore);
  lookupStore = inject(LookupStore);
  authStore = inject(AuthStore);
  fb = inject(FormBuilder);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      name: [{ value: '', disabled: true }], // Auto-computed
      status: ['Active', Validators.required],
      phone: [''],
      phone2: [''],
      address: this.fb.group({
        street1: ['', Validators.required],
        street2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
      }),
    });

    effect(() => {
      const household = this.store.selectedHousehold();
      if (household) {
        this.patchForm(household);
      } else {
        this.form.reset({
          status: 'Active',
          address: {
            city: 'Wayne',
            state: 'PA',
            zip: '19087',
          },
        });
      }
    });
  }

  ngOnInit() {}

  patchForm(household: Household) {
    this.form.patchValue({
      name: household.name,
      status: household.status,
      phone: household.phone,
      address: household.address,
    });
  }

  save() {
    if (this.form.invalid) return;

    // Check permission again in code for safety
    if (!this.authStore.hasPermission('household.edit')) {
      return;
    }

    const formValue = this.form.getRawValue();
    const household = this.store.selectedHousehold();

    const updatedHousehold: Household = {
      ...(household || ({} as Household)), // Preserve existing ID and other fields
      id: household?.id || crypto.randomUUID(), // Generate ID if new
      name: formValue.name || 'New Household', // Name might be re-computed elsewhere or handled by backend
      status: formValue.status,
      phone: formValue.phone,
      address: formValue.address,
      memberCount: household?.memberCount || 0,
      members: household?.members || [],
      documents: household?.documents || [],
      pictures: household?.pictures || [],
    };

    if (household) {
      this.store.updateHousehold(updatedHousehold);
    } else {
      this.store.addHousehold(updatedHousehold);
    }
  }
}
