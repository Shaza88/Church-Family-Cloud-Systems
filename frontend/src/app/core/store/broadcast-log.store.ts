import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap } from 'rxjs';
import { BroadcastLog } from '../models/broadcast-log.model';
import { BroadcastLogService } from '../services/broadcast-log.service';
import { NotificationService } from '../services/notification.service';

type BroadcastLogState = {
  logs: BroadcastLog[];
  loading: boolean;
  saving: boolean;
  error: string | null;
};

const initialState: BroadcastLogState = {
  logs: [],
  loading: false,
  saving: false,
  error: null,
};

export const BroadcastLogStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ logs, loading, saving }) => ({
    allLogs: computed(() => logs()), // Already sorted newest-first by service
    isLoading: computed(() => loading()),
    isSaving: computed(() => saving()),
  })),
  withMethods(
    (
      store,
      broadcastLogService = inject(BroadcastLogService),
      notificationService = inject(NotificationService)
    ) => ({
      loadLogs: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(() =>
            broadcastLogService.getLogs().pipe(
              tap({
                next: (logs) => patchState(store, { logs, loading: false }),
                error: (err) => {
                  patchState(store, { loading: false, error: err.message || 'Failed to load broadcast history.' });
                  notificationService.error('Failed to load broadcast history.');
                },
              })
            )
          )
        )
      ),

      addLog(log: Omit<BroadcastLog, 'id' | 'dateSent'>): void {
        patchState(store, { saving: true, error: null });
        const newLog: BroadcastLog = {
          ...log,
          id: crypto.randomUUID(),
          dateSent: new Date().toISOString(),
        };

        broadcastLogService.addLog(newLog).subscribe({
          next: (saved) => {
            // Prepend to keep newest-first ordering in the signal store
            patchState(store, {
              logs: [saved, ...store.logs()],
              saving: false,
            });
          },
          error: (err) => {
            patchState(store, { saving: false, error: err.message || 'Failed to save broadcast log.' });
            notificationService.error('Failed to save broadcast log.');
          },
        });
      },
    })
  )
);
