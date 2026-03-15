import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { LookupType, LookupValue } from '../models/lookup.model';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private lookups: LookupValue[] = [
    { id: '1', type: 'Gender', value: 'Male' },
    { id: '2', type: 'Gender', value: 'Female' },
    { id: '3', type: 'HouseholdStatus', value: 'Active' },
    { id: '4', type: 'HouseholdStatus', value: 'Visitor' },
    { id: '5', type: 'HouseholdStatus', value: 'Inactive' },
    { id: '6', type: 'Profession', value: 'Engineer' },
    { id: '7', type: 'Profession', value: 'Teacher' },
    { id: '8', type: 'Profession', value: 'Doctor' },
    { id: '9', type: 'Profession', value: 'Nurse' },
    { id: '10', type: 'Profession', value: 'Student' },
    { id: '11', type: 'Profession', value: 'Retired' },
    { id: '12', type: 'Relationship', value: 'Father' },
    { id: '13', type: 'Relationship', value: 'Mother' },
    { id: '14', type: 'Relationship', value: 'Son' },
    { id: '15', type: 'Relationship', value: 'Daughter' },
    { id: '16', type: 'Relationship', value: 'Grandfather' },
    { id: '17', type: 'Relationship', value: 'Grandmother' },
    { id: '18', type: 'Relationship', value: 'Aunt' },
    { id: '19', type: 'Relationship', value: 'Uncle' },
    { id: '20', type: 'Relationship', value: 'Cousin' },
    { id: '21', type: 'HouseholdRelationshipType', value: 'Godparent' },
    { id: '22', type: 'HouseholdRelationshipType', value: 'Spiritual Kinship' },
  ];

  getLookups(): Observable<LookupValue[]> {
    return of([...this.lookups]).pipe(delay(500));
  }

  addLookup(lookup: LookupValue): Observable<LookupValue> {
    this.lookups.push(lookup);
    return of(lookup).pipe(delay(500));
  }

  updateLookup(id: string, updates: Partial<LookupValue>): Observable<LookupValue> {
    const index = this.lookups.findIndex((l) => l.id === id);
    if (index !== -1) {
      this.lookups[index] = { ...this.lookups[index], ...updates };
      return of(this.lookups[index]).pipe(delay(500));
    }
    throw new Error(`Lookup with id ${id} not found`);
  }

  deleteLookup(id: string): Observable<void> {
    this.lookups = this.lookups.filter((l) => l.id !== id);
    return of(undefined).pipe(delay(500));
  }
}
