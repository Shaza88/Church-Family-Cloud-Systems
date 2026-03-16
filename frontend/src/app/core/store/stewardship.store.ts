import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Stewardship } from '../models/stewardship.model';
import { StewardshipService } from '../services/stewardship.service';
import { NotificationService } from '../services/notification.service';

type StewardshipState = {
  stewardships: Stewardship[];
  isLoading: boolean;
  isSaving: boolean;
};

const initialState: StewardshipState = {
  stewardships: [],
  isLoading: false,
  isSaving: false,
};

export const StewardshipStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ stewardships }) => ({
    availableFiscalYears: computed(() => {
      const currentYear = new Date().getFullYear();
      const possibleYears = [
        String(currentYear - 1),
        String(currentYear),
        String(currentYear + 1),
        String(currentYear + 2),
      ];
      const existingYears = stewardships().map((s) => String(s.fiscalYear));
      return possibleYears.filter((year) => !existingYears.includes(year));
    }),
    totalPledgedAmount: computed(() => 
      stewardships()
        .filter(s => s.status === 'Active')
        .reduce((sum, s) => sum + s.totalYearlyAmount, 0)
    )
  })),
  withMethods(
    (
      store,
      stewardshipService = inject(StewardshipService),
      notificationService = inject(NotificationService),
    ) => ({
      loadStewardshipsForHousehold: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((householdId) =>
            stewardshipService.getStewardshipsByHousehold(householdId).pipe(
              tap({
                next: (stewardships) => patchState(store, { stewardships, isLoading: false }),
                error: () => {
                  patchState(store, { isLoading: false });
                  notificationService.error('Failed to load stewardships.');
                },
              })
            ),
          ),
        ),
      ),

      addStewardship: rxMethod<Omit<Stewardship, 'id' | 'createdAt' | 'createdBy'>>(
        pipe(
          tap(() => patchState(store, { isSaving: true })),
          switchMap((stewardship) => {
            const newStewardship: Stewardship = {
              ...stewardship,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              createdBy: 'current_user',
            };
            return stewardshipService.addStewardship(newStewardship).pipe(
              tap({
                next: (addedStewardship) => {
                  patchState(store, {
                    stewardships: [...store.stewardships(), addedStewardship],
                    isSaving: false,
                  });
                  notificationService.success('Stewardship successfully added.');
                },
                error: (err) => {
                  patchState(store, { isSaving: false });
                  notificationService.error(err.message || 'Failed to add stewardship.');
                },
              })
            );
          })
        )
      ),

      updateStewardship: rxMethod<{ id: string; updates: Partial<Stewardship> }>(
        pipe(
          tap(() => patchState(store, { isSaving: true })),
          switchMap(({ id, updates }) =>
            stewardshipService.updateStewardship(id, updates).pipe(
              tap({
                next: (updatedStewardship) => {
                  const updatedStewardships = store.stewardships().map((s) => (s.id === id ? updatedStewardship : s));
                  patchState(store, { stewardships: updatedStewardships, isSaving: false });
                  notificationService.success('Stewardship updated successfully.');
                },
                error: (err) => {
                  patchState(store, { isSaving: false });
                  notificationService.error(err.message || 'Failed to update stewardship.');
                },
              })
            )
          )
        )
      ),

      deleteStewardship: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isSaving: true })),
          switchMap((id) =>
            stewardshipService.deleteStewardship(id).pipe(
              tap({
                next: () => {
                  const filteredStewardships = store.stewardships().filter((s) => s.id !== id);
                  patchState(store, { stewardships: filteredStewardships, isSaving: false });
                  notificationService.success('Stewardship deleted successfully.');
                },
                error: () => {
                  patchState(store, { isSaving: false });
                  notificationService.error('Failed to delete stewardship.');
                },
              })
            )
          )
        )
      ),
    }),
  ),
);
