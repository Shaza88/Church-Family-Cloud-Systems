import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HouseholdStore } from '../../../../core/store/household.store';
import { StewardshipStore } from '../../../../core/store/stewardship.store';
import { Stewardship } from '../../../../core/models/stewardship.model';
import { StewardshipFormDialogComponent } from './stewardship-form-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-household-stewardships',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    EmptyStateComponent,
  ],
  templateUrl: './household-stewardships.component.html',
})
export class HouseholdStewardshipsComponent implements OnInit {
  householdStore = inject(HouseholdStore);
  stewardshipStore = inject(StewardshipStore);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['fiscalYear', 'amount', 'frequency', 'totalYearly', 'status', 'actions'];

  ngOnInit(): void {
    const householdId = this.householdStore.selectedHousehold()?.id;
    if (householdId) {
      this.stewardshipStore.loadStewardshipsForHousehold(householdId);
    }
  }

  openAddStewardshipDialog() {
    const householdId = this.householdStore.selectedHousehold()?.id;
    if (!householdId) return;

    this.dialog.open(StewardshipFormDialogComponent, {
      width: '600px',
      data: { householdId }
    });
  }

  openEditStewardshipDialog(stewardship: Stewardship) {
    const householdId = this.householdStore.selectedHousehold()?.id;
    if (!householdId) return;

    this.dialog.open(StewardshipFormDialogComponent, {
      width: '600px',
      data: { householdId, stewardship }
    });
  }

  deleteStewardship(stewardship: Stewardship) {
    if (confirm(`Are you sure you want to delete the stewardship record for ${stewardship.fiscalYear}?`)) {
      this.stewardshipStore.deleteStewardship(stewardship.id);
    }
  }
}
