import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Fund } from '../models/fund.model';
import { MOCK_FUNDS } from '../data/mock-funds';

@Injectable({
  providedIn: 'root'
})
export class FundService {
  private funds = [...MOCK_FUNDS];

  getFunds(): Observable<Fund[]> {
    return of([...this.funds]).pipe(delay(500));
  }

  addFund(fund: Fund): Observable<Fund> {
    this.funds.push(fund);
    return of(fund).pipe(delay(500));
  }

  updateFund(id: string, updates: Partial<Fund>): Observable<Fund> {
    const index = this.funds.findIndex(f => f.id === id);
    if (index !== -1) {
      this.funds[index] = { ...this.funds[index], ...updates };
      return of(this.funds[index]).pipe(delay(500));
    }
    throw new Error(`Fund with id ${id} not found`);
  }

  deleteFund(id: string): Observable<void> {
    this.funds = this.funds.filter(f => f.id !== id);
    return of(undefined).pipe(delay(500));
  }
}
