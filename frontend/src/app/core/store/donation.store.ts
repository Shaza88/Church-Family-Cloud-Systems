import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Donation } from '../models/donation.model';
import { DonationService } from '../services/donation.service';
import { NotificationService } from '../services/notification.service';

type DonationState = {
  donations: Donation[];
  isLoading: boolean;
  error: string | null;
};

const initialState: DonationState = {
  donations: [],
  isLoading: false,
  error: null,
};

export const DonationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ donations }) => ({
    sortedDonations: computed(() => {
      // Sort donations by date (newest first)
      return [...donations()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    })
  })),
  withMethods(
    (
      store,
      donationService = inject(DonationService),
      notificationService = inject(NotificationService),
    ) => ({
      loadDonationsForHousehold: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((householdId) =>
            donationService.getDonationsByHousehold(householdId).pipe(
              tap({
                next: (donations) => patchState(store, { donations, isLoading: false }),
                error: (err) => {
                  patchState(store, { isLoading: false, error: err.message || 'Failed to load donations.' });
                  notificationService.error('Failed to load donations.');
                },
              })
            ),
          ),
        ),
      ),

      loadDonationsForBatch: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((batchId) =>
            donationService.getDonationsByBatchId(batchId).pipe(
              tap({
                next: (donations) => patchState(store, { donations, isLoading: false }),
                error: (err) => {
                  patchState(store, { isLoading: false, error: err.message || 'Failed to load batch donations.' });
                  notificationService.error('Failed to load batch donations.');
                },
              })
            ),
          ),
        ),
      ),

      addDonationsBatch: rxMethod<Omit<Donation, 'id' | 'createdAt' | 'createdBy'>[]>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((donations) => {
            const newDonations: Donation[] = donations.map(d => ({
              ...d,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              createdBy: 'current_user',
            }));
            
            return donationService.addDonationsBatch(newDonations).pipe(
              tap({
                next: (addedDonations) => {
                  patchState(store, {
                    donations: [...addedDonations, ...store.donations()],
                    isLoading: false,
                  });
                  notificationService.success(`${addedDonations.length} donations saved strictly.`);
                },
                error: (err) => {
                  patchState(store, { isLoading: false, error: err.message || 'Failed to save batch donations.' });
                  notificationService.error(err.message || 'Failed to save batch donations.');
                },
              })
            );
          })
        )
      ),
    })
  ),
);
