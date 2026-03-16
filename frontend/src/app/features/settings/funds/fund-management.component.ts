import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { FundStore } from '../../../core/store/fund.store';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FundFormDialogComponent } from './fund-form-dialog.component';
import { Fund } from '../../../core/models/fund.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'cfcs-fund-management',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatChipsModule,
    MatMenuModule,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './fund-management.component.html',
})
export class FundManagementComponent implements OnInit {
  store = inject(FundStore);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'description', 'status', 'taxDeductible', 'actions'];

  ngOnInit() {
    this.store.loadFunds();
  }

  openAddFundDialog() {
    this.dialog.open(FundFormDialogComponent, {
      width: '500px',
    });
  }

  openEditFundDialog(fund: Fund) {
    this.dialog.open(FundFormDialogComponent, {
      width: '500px',
      data: { fund },
    });
  }

  deleteFund(fund: Fund) {
    if (confirm(`Are you sure you want to delete the fund '${fund.name}'?`)) {
      this.store.deleteFund(fund.id);
    }
  }
}
