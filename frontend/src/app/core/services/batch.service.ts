import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Batch } from '../models/batch.model';
import { MOCK_BATCHES } from '../data/mock-donations';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private batches = [...MOCK_BATCHES];

  getBatches(): Observable<Batch[]> {
    return of([...this.batches]).pipe(delay(500));
  }

  getBatchById(id: string): Observable<Batch | undefined> {
    const batch = this.batches.find(b => b.id === id);
    return of(batch).pipe(delay(300));
  }

  addBatch(batch: Batch): Observable<Batch> {
    this.batches.push(batch);
    return of(batch).pipe(delay(400));
  }

  updateBatch(updatedBatch: Batch): Observable<Batch> {
    const index = this.batches.findIndex(b => b.id === updatedBatch.id);
    if (index !== -1) {
      this.batches[index] = { ...this.batches[index], ...updatedBatch };
    }
    return of(updatedBatch).pipe(delay(400));
  }

  deleteBatch(id: string): Observable<boolean> {
    const index = this.batches.findIndex(b => b.id === id);
    if (index !== -1) {
      this.batches.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
