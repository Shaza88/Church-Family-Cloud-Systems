import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Stewardship } from '../models/stewardship.model';
import { MOCK_STEWARDSHIPS } from '../data/mock-stewardships';

@Injectable({
  providedIn: 'root'
})
export class StewardshipService {
  private stewardships = [...MOCK_STEWARDSHIPS];

  getStewardshipsByHousehold(householdId: string): Observable<Stewardship[]> {
    const householdStewardships = this.stewardships.filter(s => s.householdId === householdId);
    return of(householdStewardships).pipe(delay(500));
  }

  addStewardship(stewardship: Stewardship): Observable<Stewardship> {
    // Basic server-side double check for identical fiscal year for the same household
    const exists = this.stewardships.some(
      (s) => s.householdId === stewardship.householdId && s.fiscalYear === stewardship.fiscalYear
    );
    if (exists) {
      throw new Error(`A stewardship record already exists for the fiscal year ${stewardship.fiscalYear}.`);
    }

    this.stewardships.push(stewardship);
    return of(stewardship).pipe(delay(500));
  }

  updateStewardship(id: string, updates: Partial<Stewardship>): Observable<Stewardship> {
    const index = this.stewardships.findIndex(s => s.id === id);
    if (index !== -1) {
      // If updating the fiscal year, make sure it doesn't conflict with another existing one for the same household
      if (updates.fiscalYear && updates.fiscalYear !== this.stewardships[index].fiscalYear) {
        const exists = this.stewardships.some(
          (s) => s.householdId === this.stewardships[index].householdId && s.fiscalYear === updates.fiscalYear && s.id !== id
        );
        if (exists) {
          throw new Error(`A stewardship record already exists for the fiscal year ${updates.fiscalYear}.`);
        }
      }

      this.stewardships[index] = { ...this.stewardships[index], ...updates };
      return of(this.stewardships[index]).pipe(delay(500));
    }
    throw new Error(`Stewardship with id ${id} not found`);
  }

  deleteStewardship(id: string): Observable<void> {
    this.stewardships = this.stewardships.filter(s => s.id !== id);
    return of(undefined).pipe(delay(500));
  }
}
