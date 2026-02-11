import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LookupStore } from '../../../core/store/lookup.store';
import { LookupValue } from '../../../core/models/lookup.model';

@Component({
  selector: 'cfcs-lookup-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './lookup-management.component.html',
  styleUrl: './lookup-management.component.scss',
})
export class LookupManagementComponent {
  lookupStore = inject(LookupStore);

  newProfession = '';
  newStatus = '';
  newGender = '';

  editingId: string | null = null;
  editingValue = '';

  addProfession() {
    if (this.newProfession.trim()) {
      this.lookupStore.addLookup('Profession', this.newProfession);
      this.newProfession = '';
    }
  }

  addStatus() {
    if (this.newStatus.trim()) {
      this.lookupStore.addLookup('HouseholdStatus', this.newStatus);
      this.newStatus = '';
    }
  }

  addGender() {
    if (this.newGender.trim()) {
      this.lookupStore.addLookup('Gender', this.newGender);
      this.newGender = '';
    }
  }

  startEdit(item: LookupValue) {
    this.editingId = item.id;
    this.editingValue = item.value;
  }

  saveEdit(id: string) {
    if (this.editingValue.trim()) {
      this.lookupStore.updateLookup(id, this.editingValue);
      this.editingId = null;
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editingValue = '';
  }
}
