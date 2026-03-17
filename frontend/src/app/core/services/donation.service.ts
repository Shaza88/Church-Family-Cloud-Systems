import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Donation } from '../models/donation.model';
import { MOCK_DONATIONS } from '../data/mock-donations';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private donations = [...MOCK_DONATIONS];

  getDonationsByHousehold(householdId: string): Observable<Donation[]> {
    const householdDonations = this.donations.filter(d => d.householdId === householdId);
    return of(householdDonations).pipe(delay(500));
  }

  addDonation(donation: Donation): Observable<Donation> {
    this.donations.push(donation);
    return of(donation).pipe(delay(500));
  }

  addDonationsBatch(donations: Donation[]): Observable<Donation[]> {
    this.donations.push(...donations);
    return of(donations).pipe(delay(500));
  }
}
