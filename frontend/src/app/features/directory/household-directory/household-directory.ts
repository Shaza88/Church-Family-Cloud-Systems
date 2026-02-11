import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { HouseholdStore } from '../../../core/store/household.store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HouseholdFormDialog } from './household-form.dialog';
import { Household } from '../../../core/models/household.model';
import { AddressPipe } from '../../../core/pipes/address.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { LookupStore } from '../../../core/store/lookup.store';

@Component({
  selector: 'cfcs-household-directory',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    AddressPipe,
    MatExpansionModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './household-directory.html',
  styleUrl: './household-directory.scss',
})
export class HouseholdDirectoryComponent implements OnInit {
  readonly store = inject(HouseholdStore);
  readonly lookupStore = inject(LookupStore);
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['name', 'status', 'members', 'actions'];

  advancedFilters = {
    status: '',
    profession: '',
    email: '',
    phone: '',
    city: '',
    zip: '',
  };

  ngOnInit() {
    this.store.loadHouseholds();
  }

  applyFilter(event: Event) {
    this.store.updateFilter((event.target as HTMLInputElement).value);
  }

  applyAdvancedFilter() {
    this.store.updateAdvancedFilter(this.advancedFilters);
  }

  clearAdvancedFilter() {
    this.advancedFilters = {
      status: '',
      profession: '',
      email: '',
      phone: '',
      city: '',
      zip: '',
    };
    this.store.updateAdvancedFilter(null);
  }

  onPageChange(event: PageEvent) {
    this.store.updatePage(event.pageIndex, event.pageSize);
  }

  onSortChange(sort: Sort) {
    this.store.updateSort(sort.active, sort.direction);
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(HouseholdFormDialog, {
      width: '1100px',
      maxWidth: '95vw',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: Household | undefined) => {
      if (result) {
        this.store.addHousehold(result);
      }
    });
  }

  openEditDialog(household: Household) {
    const dialogRef = this.dialog.open(HouseholdFormDialog, {
      width: '1100px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: household,
    });

    dialogRef.afterClosed().subscribe((result: Household | undefined) => {
      if (result) {
        this.store.updateHousehold(result);
      }
    });
  }
}
