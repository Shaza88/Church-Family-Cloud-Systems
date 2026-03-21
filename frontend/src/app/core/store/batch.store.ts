import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Batch } from '../models/batch.model';
import { BatchService } from '../services/batch.service';
import { NotificationService } from '../services/notification.service';
import { AuthStore } from './auth.store';

type BatchState = {
  batches: Batch[];
  selectedBatch: Batch | null;
  isLoading: boolean;
};

const initialState: BatchState = {
  batches: [],
  selectedBatch: null,
  isLoading: false,
};

export const BatchStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ batches }) => ({
    sortedBatches: computed(() => {
      return [...batches()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    })
  })),
  withMethods(
    (
      store,
      batchService = inject(BatchService),
      authStore = inject(AuthStore),
      notificationService = inject(NotificationService),
    ) => ({
      loadBatches: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            batchService.getBatches().pipe(
              tap({
                next: (batches) => patchState(store, { batches, isLoading: false }),
                error: (err) => {
                  patchState(store, { isLoading: false });
                  notificationService.error(err.message || 'Failed to load batches.');
                },
              })
            ),
          ),
        ),
      ),

      loadBatchById: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((id) =>
            batchService.getBatchById(id).pipe(
              tap({
                next: (batch) => {
                  if (batch) {
                    patchState(store, { selectedBatch: batch, isLoading: false });
                  } else {
                    patchState(store, { selectedBatch: null, isLoading: false });
                    notificationService.error('Batch not found.');
                  }
                },
                error: () => patchState(store, { isLoading: false }),
              })
            )
          )
        )
      ),

      createBatch: rxMethod<{ date: string; expectedTotal: number }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((data) => {
            const currentUserEmail = authStore.user()?.email || 'system';
            const now = new Date().toISOString();
            
            const newBatch: Batch = {
              id: crypto.randomUUID(),
              date: data.date,
              expectedTotal: data.expectedTotal,
              actualTotal: 0,
              donationCount: 0,
              status: 'Open',
              createdBy: currentUserEmail,
              createdAt: now,
              lastModifiedBy: currentUserEmail,
              lastModifiedAt: now,
            };

            return batchService.addBatch(newBatch).pipe(
              tap({
                next: (added) => {
                  patchState(store, {
                    batches: [added, ...store.batches()],
                    selectedBatch: added,
                    isLoading: false,
                  });
                  notificationService.success('New batch opened successfully.');
                },
                error: () => {
                  patchState(store, { isLoading: false });
                  notificationService.error('Failed to create batch.');
                }
              })
            );
          })
        )
      ),

      updateBatchStatus: rxMethod<{ id: string, status: 'Posted', actualTotal: number, donationCount: number }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(({ id, status, actualTotal, donationCount }) => {
             const batchToUpdate = store.batches().find(b => b.id === id);
             if (!batchToUpdate) {
               patchState(store, { isLoading: false });
               return [];
             }

             const currentUserEmail = authStore.user()?.email || 'system';
             const updatedBatch: Batch = { 
               ...batchToUpdate, 
               status, 
               actualTotal,
               donationCount,
               lastModifiedBy: currentUserEmail,
               lastModifiedAt: new Date().toISOString()
             };

             return batchService.updateBatch(updatedBatch).pipe(
               tap({
                 next: (saved) => {
                   patchState(store, {
                     batches: store.batches().map(b => b.id === saved.id ? saved : b),
                     selectedBatch: store.selectedBatch()?.id === saved.id ? saved : store.selectedBatch(),
                     isLoading: false,
                   });
                   notificationService.success(`Batch successfully ${status.toLowerCase()}!`);
                 },
                 error: () => {
                   patchState(store, { isLoading: false });
                   notificationService.error('Failed to update batch status.');
                 }
               })
             );
          })
        )
      )
    })
  ),
);
