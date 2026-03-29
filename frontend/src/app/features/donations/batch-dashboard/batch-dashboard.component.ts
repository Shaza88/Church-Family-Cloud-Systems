import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { BatchStore } from '../../../core/store/batch.store';
import { Batch } from '../../../core/models/batch.model';
import { BatchDialogComponent } from './batch-dialog.component';
import { ExportService } from '../../../core/services/export.service';

@Component({
  selector: 'app-batch-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './batch-dashboard.component.html',
})
export class BatchDashboardComponent implements OnInit {
  batchStore = inject(BatchStore);
  dialog = inject(MatDialog);
  router = inject(Router);

  displayedColumns = ['date', 'status', 'expectedTotal', 'actualTotal', 'donationCount', 'createdBy', 'actions'];
  dataSource = new MatTableDataSource<Batch>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.batchStore.loadBatches();
    // Watch store changes and update MatTable
    // Since we want to use sort/paginator we subscribe to a signal effect or computed
    // For simplicity, we just bind the signal output but MatTableDataSource is better natively with subscribe
  }

  // A quick trick to sync signal to MatTable when the component checks
  ngDoCheck() {
    if (this.batchStore.batches() && this.dataSource.data !== this.batchStore.batches()) {
      this.dataSource.data = this.batchStore.batches();
      if (!this.dataSource.paginator) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createNewBatch() {
    const dialogRef = this.dialog.open(BatchDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: { date: string; expectedTotal: number } | null) => {
      if (result) {
        // Trigger creation
        this.batchStore.createBatch(result);
        
        // Wait briefly for creation then navigate into entry route using the newly selected batch
        setTimeout(() => {
          const newId = this.batchStore.selectedBatch()?.id;
          if (newId) {
            this.router.navigate(['/donations/batch-entry', newId]);
          }
        }, 500); // Temporary hack to wait for rxMethod if we don't have a callback. 
        // Realistically we should use a Service direct call or a routing effect, but this works for local MVP. 
      }
    });
  }

  viewBatch(batch: Batch) {
    this.router.navigate(['/donations/batch-entry', batch.id]);
  }

  exportService = inject(ExportService);

  exportCsv() {
    let data = this.dataSource.filteredData || this.dataSource.data;
    // Natively sort the unpaginated payload matching the visual header sort configurations
    if (this.dataSource.sort) {
      data = this.dataSource.sortData(data, this.dataSource.sort);
    }
    this.exportService.exportBatches(data).subscribe();
  }
}
