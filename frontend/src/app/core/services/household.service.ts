import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Household } from '../models/household.model';
import { getHouseholds, MOCK_HOUSEHOLDS } from '../data/mock-households';
import { QueryRequest } from '../models/query.model';

@Injectable({
  providedIn: 'root'
})
export class HouseholdService {
  // Uses the existing mock function that already handles filtering/sorting
  getHouseholds(query: QueryRequest): Observable<{ items: Household[]; total: number }> {
    return getHouseholds(query);
  }

  getHouseholdById(id: string): Observable<Household | undefined> {
    const household = MOCK_HOUSEHOLDS.find((h) => h.id === id);
    return of(household).pipe(delay(500));
  }

  addHousehold(household: Household): Observable<Household> {
    MOCK_HOUSEHOLDS.push(household);
    return of(household).pipe(delay(500));
  }

  updateHousehold(household: Household): Observable<Household> {
    const index = MOCK_HOUSEHOLDS.findIndex((h) => h.id === household.id);
    if (index !== -1) {
      MOCK_HOUSEHOLDS[index] = household;
      return of(household).pipe(delay(500));
    }
    throw new Error(`Household with id ${household.id} not found`);
  }
}
