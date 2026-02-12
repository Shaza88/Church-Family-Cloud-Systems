import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HouseholdStore } from '../../../../core/store/household.store';
import { LookupStore } from '../../../../core/store/lookup.store';
import { Household } from '../../../../core/models/household.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-household-relationships',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './household-relationships.component.html',
})
export class HouseholdRelationshipsComponent {
  store = inject(HouseholdStore);
  lookupStore = inject(LookupStore);
  notificationService = inject(NotificationService);
  fb = inject(FormBuilder);

  form: FormGroup;
  displayedColumns = ['household', 'type', 'notes', 'actions'];

  // Autocomplete source
  searchControl = this.fb.control('');
  selectedHouseholdId: string | null = null;

  // Current household's relationships with resolved names
  relationships = computed(() => {
    const household = this.store.selectedHousehold();
    if (!household || !household.relatedHouseholds) return [];

    const allHouseholds = this.store.households();

    return household.relatedHouseholds.map((rel) => {
      const relatedHH = allHouseholds.find((h) => h.id === rel.householdId);
      return {
        ...rel,
        householdName: relatedHH ? relatedHH.name : `Household...`, // In real app, load if missing
      };
    });
  });

  // Filtered households for autocomplete
  filteredHouseholds = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const currentId = this.store.selectedHousehold()?.id;
    return this.store
      .households()
      .filter((h) => h.id !== currentId && h.name.toLowerCase().includes(query));
  });

  // Signal for search query
  searchQuery = signal('');

  constructor() {
    this.form = this.fb.group({
      relatedHouseholdId: ['', Validators.required],
      type: ['', Validators.required],
      notes: [''],
    });
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);

    // Invalidate selection on type
    this.selectedHouseholdId = null;
    this.form.patchValue({ relatedHouseholdId: '' });
  }

  onOptionSelected(event: any) {
    const household = event.option.value;
    this.selectedHouseholdId = household.id;
    this.form.patchValue({ relatedHouseholdId: household.id });
    this.searchControl.setValue(household.name);
  }

  addRelationship() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const household = this.store.selectedHousehold();

    if (!household) return;

    const newRel = {
      householdId: formValue.relatedHouseholdId,
      relationshipType: formValue.type,
      notes: formValue.notes,
    };

    const updatedHousehold: Household = {
      ...household,
      relatedHouseholds: [...(household.relatedHouseholds || []), newRel],
    };

    this.store.updateHousehold(updatedHousehold);
    this.notificationService.success('Relationship added');

    // Reset
    this.form.reset();
    this.searchControl.setValue('');
    this.selectedHouseholdId = null;
    this.searchQuery.set('');
  }

  removeRelationship(rel: any) {
    const household = this.store.selectedHousehold();
    if (!household) return;

    const updatedHousehold: Household = {
      ...household,
      relatedHouseholds: (household.relatedHouseholds || []).filter((r) => r !== rel),
    };

    this.store.updateHousehold(updatedHousehold);
    this.notificationService.success('Relationship removed');
  }
}
