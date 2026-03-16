import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Stewardship } from '../models/stewardship.model';
import { StewardshipService } from '../services/stewardship.service';
import { NotificationService } from '../services/notification.service';

type StewardshipState = {
  stewardships: Stewardship[];
  loading: boolean;
  saving: boolean;
};

const initialState: StewardshipState = {
  stewardships: [],
  loading: false,
  saving: false,
};

export const StewardshipStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      stewardshipService = inject(StewardshipService),
      notificationService = inject(NotificationService),
    ) => ({
      loadStewardshipsForHousehold: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((householdId) =>
            stewardshipService.getStewardshipsByHousehold(householdId).pipe(
              tap({
                next: (stewardships) => patchState(store, { stewardships, loading: false }),
                error: () => {
                  patchState(store, { loading: false });
                  notificationService.error('Failed to load stewardships.');
                },
              })
            ),
          ),
        ),
      ),

      addStewardship(stewardship: Omit<Stewardship, 'id' | 'createdAt' | 'createdBy'>) {
        patchState(store, { saving: true });
        const newStewardship: Stewardship = {
          ...stewardship,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          createdBy: 'current_user',
        };

        stewardshipService.addStewardship(newStewardship).subscribe({
          next: (addedStewardship) => {
            patchState(store, {
              stewardships: [...store.stewardships(), addedStewardship],
              saving: false,
            });
            notificationService.success('Stewardship successfully added.');
          },
          error: (err) => {
            patchState(store, { saving: false });
            notificationService.error(err.message || 'Failed to add stewardship.');
          },
        });
      },

      updateStewardship(id: string, updates: Partial<Stewardship>) {
        patchState(store, { saving: true });

        stewardshipService.updateStewardship(id, updates).subscribe({
          next: (updatedStewardship) => {
            const updatedStewardships = store.stewardships().map((s) => (s.id === id ? updatedStewardship : s));
            patchState(store, { stewardships: updatedStewardships, saving: false });
            notificationService.success('Stewardship updated successfully.');
          },
          error: (err) => {
            patchState(store, { saving: false });
            notificationService.error(err.message || 'Failed to update stewardship.');
          },
        });
      },

      deleteStewardship(id: string) {
        patchState(store, { saving: true });

        stewardshipService.deleteStewardship(id).subscribe({
          next: () => {
            const filteredStewardships = store.stewardships().filter((s) => s.id !== id);
            patchState(store, { stewardships: filteredStewardships, saving: false });
            notificationService.success('Stewardship deleted successfully.');
          },
          error: () => {
            patchState(store, { saving: false });
            notificationService.error('Failed to delete stewardship.');
          },
        });
      },
    }),
  ),
);
