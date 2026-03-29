import { Injectable } from '@angular/core';
import { Observable, of, delay, tap, map } from 'rxjs';
import { exportToCsv } from '../utils/csv-export.util';
import { Household } from '../models/household.model';
import { Batch } from '../models/batch.model';
import { QueryRequest } from '../models/query.model';
import { HouseholdService } from './household.service';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private householdService = inject(HouseholdService);

  /**
   * Mock backend endpoint for exporting households.
   * When implementing the real backend, replace the body of this method with:
   * return this.http.post('api/export/households', query, { responseType: 'blob' }).pipe(...)
   */
  exportHouseholds(query: QueryRequest): Observable<boolean> {
    // Override pagination to fetch all mathing records synthetically from mock DB
    const exportQuery = { ...query, pageIndex: 0, pageSize: 999999 };
    
    return this.householdService.getHouseholds(exportQuery).pipe(
      delay(400), // Simulate network request for backend generation
      tap((response) => {
        const headers = ['ID', 'Name', 'Status', 'Member Count', 'Street Address', 'City', 'State', 'Zip'];
        const rows = [headers];
        
        response.items.forEach(h => {
          rows.push([
            h.id,
            h.name,
            h.status,
            h.memberCount?.toString() || '0',
            h.address?.street1 || '',
            h.address?.city || '',
            h.address?.state || '',
            h.address?.zip || ''
          ]);
        });
        
        exportToCsv('household-directory-export.csv', rows);
      }),
      map(() => true)
    );
  }

  /**
   * Mock backend endpoint for exporting accounting batches.
   * Later this will simply call `api/export/batches` passing filters payload.
   */
  exportBatches(batches: Batch[]): Observable<boolean> {
    return of(true).pipe(
      delay(400),
      tap(() => {
        const headers = ['ID', 'Date', 'Status', 'Expected Total', 'Actual Total', 'Donation Count', 'Created By', 'Created At'];
        const rows = [headers];
        
        batches.forEach(b => {
          rows.push([
            b.id,
            b.date,
            b.status,
            b.expectedTotal.toString(),
            b.actualTotal.toString(),
            b.donationCount.toString(),
            b.createdBy || '',
            b.createdAt || ''
          ]);
        });
        
        exportToCsv('batch-history-export.csv', rows);
      })
    );
  }
}
