import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { HouseholdStore } from '../../../../core/store/household.store';
import { NotificationService } from '../../../../core/services/notification.service';
import { Household } from '../../../../core/models/household.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-household-documents',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule, MatDialogModule, EmptyStateComponent],
  templateUrl: './household-documents.component.html',
})
export class HouseholdDocumentsComponent {
  store = inject(HouseholdStore);
  notificationService = inject(NotificationService);

  documents = computed(() => this.store.selectedHousehold()?.documents || []);
  displayedColumns = ['name', 'type', 'date', 'actions'];

  uploadDocument(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const household = this.store.selectedHousehold();
    if (!household) return;

    // Simulate upload delay
    setTimeout(() => {
      const newDoc = {
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        url: '#', // In real app, this would be the uploaded URL
        date: new Date(),
      };

      const updatedHousehold: Household = {
        ...household,
        documents: [...(household.documents || []), newDoc],
      };

      this.store.updateHousehold(updatedHousehold);
      this.notificationService.success('Document uploaded successfully');

      // Reset input
      input.value = '';
    }, 500);
  }

  deleteDocument(doc: any) {
    const household = this.store.selectedHousehold();
    if (!household) return;

    const updatedHousehold: Household = {
      ...household,
      documents: (household.documents || []).filter((d) => d !== doc),
    };

    this.store.updateHousehold(updatedHousehold);
    this.notificationService.success('Document deleted successfully');
  }
}
