import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { HouseholdStore } from '../../../../core/store/household.store';
import { NotificationService } from '../../../../core/services/notification.service';
import { Household } from '../../../../core/models/household.model';

@Component({
  selector: 'app-household-pictures',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatTableModule],
  templateUrl: './household-pictures.component.html',
})
export class HouseholdPicturesComponent {
  store = inject(HouseholdStore);
  notificationService = inject(NotificationService);

  pictures = computed(() => this.store.selectedHousehold()?.pictures || []);
  displayedColumns = ['name', 'date', 'actions'];

  uploadPicture(fileInput: HTMLInputElement) {
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
      const newPic = {
        name: file.name,
        url: URL.createObjectURL(file), // Use object URL for preview
        date: new Date(),
      };

      const updatedHousehold: Household = {
        ...household,
        pictures: [...(household.pictures || []), newPic],
      };

      this.store.updateHousehold(updatedHousehold);
      this.notificationService.success('Picture uploaded successfully');

      // Reset input
      input.value = '';
    }, 500);
  }

  deletePicture(pic: any) {
    const household = this.store.selectedHousehold();
    if (!household) return;

    const updatedHousehold: Household = {
      ...household,
      pictures: (household.pictures || []).filter((p) => p !== pic),
    };

    this.store.updateHousehold(updatedHousehold);
    this.notificationService.success('Picture deleted successfully');
  }
}
