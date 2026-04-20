import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Batch, BatchStatus } from '../models/batch.model';
import { BatchService } from '../services/batch.service';
import { NotificationService } from '../services/notification.service';
import { AuthStore } from './auth.store';

type BatchState = {
  batches: Batch[];
  selectedBatch: Batch | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: BatchState = {
  batches: [],
  selectedBatch: null,
  isLoading: false,
  error: null,
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
      clearSelectedBatch: () => patchState(store, { selectedBatch: null }),
      
      loadBatches: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(() =>
            batchService.getBatches().pipe(
              tap({
                next: (batches) => patchState(store, { batches, isLoading: false }),
                error: (err) => {
                  patchState(store, { isLoading: false, error: err.message || 'Failed to load batches.' });
                  notificationService.error(err.message || 'Failed to load batches.');
                },
              })
            ),
          ),
        ),
      ),

      loadBatchById: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null, selectedBatch: null })),
          switchMap((id) =>
            batchService.getBatchById(id).pipe(
              tap({
                next: (batch) => {
                  if (batch) {
                    patchState(store, { selectedBatch: batch, isLoading: false });
                  } else {
                    patchState(store, { selectedBatch: null, isLoading: false, error: 'Batch not found.' });
                    notificationService.error('Batch not found.');
                  }
                },
                error: (err) => {
                  patchState(store, { isLoading: false, error: err.message || 'Failed to load batch.' });
                  notificationService.error('Failed to load batch.');
                },
              })
            )
          )
        )
      ),

      createBatch: rxMethod<{ date: string; expectedTotal: number }>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((data) => {
            const currentUserEmail = authStore.user()?.email || 'system';
            const now = new Date().toISOString();
            
            const newBatch: Batch = {
              id: crypto.randomUUID(),
              date: data.date,
              expectedTotal: data.expectedTotal,
              actualTotal: 0,
              donationCount: 0,
              status: BatchStatus.Open,
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
                error: (err) => {
                  patchState(store, { isLoading: false, error: err.message || 'Failed to create batch.' });
                  notificationService.error('Failed to create batch.');
                }
              })
            );
          })
        )
      ),

      updateBatchStatus: rxMethod<{ id: string, status: BatchStatus, actualTotal: number, donationCount: number }>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(({ id, status, actualTotal, donationCount }) => {
             const batchToUpdate = store.batches().find(b => b.id === id);
             if (!batchToUpdate) {
               patchState(store, { isLoading: false, error: 'Batch not found locally.' });
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
                 error: (err) => {
                   patchState(store, { isLoading: false, error: err.message || 'Failed to update batch status.' });
                   notificationService.error('Failed to update batch status.');
                 }
               })
             );
          })
        )
      ),

      deleteBatch: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((id) =>
            batchService.deleteBatch(id).pipe(
              tap({
                next: (success) => {
                  if (success) {
                    patchState(store, {
                      batches: store.batches().filter(b => b.id !== id),
                      isLoading: false,
                    });
                    notificationService.success('Batch successfully deleted.');
                  } else {
                    patchState(store, { isLoading: false, error: 'Batch not found.' });
                    notificationService.error('Batch not found to delete.');
                  }
                },
                error: (err) => {
                  patchState(store, { isLoading: false, error: err.message || 'Failed to delete batch.' });
                  notificationService.error('Failed to delete batch.');
                }
              })
            )
          )
        )
      )
    })
  ),
);
