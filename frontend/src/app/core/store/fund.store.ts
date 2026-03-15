import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Fund } from '../models/fund.model';
import { FundService } from '../services/fund.service';
import { NotificationService } from '../services/notification.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap } from 'rxjs';

type FundState = {
  funds: Fund[];
  loading: boolean;
  saving: boolean;
  error: string | null;
};

const initialState: FundState = {
  funds: [],
  loading: false,
  saving: false,
  error: null,
};

export const FundStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ funds, loading, saving }) => ({
    allFunds: computed(() => funds()),
    activeFunds: computed(() => funds().filter((f) => f.active)),
    isLoading: computed(() => loading()),
    isSaving: computed(() => saving()),
  })),
  withMethods((store, fundService = inject(FundService), notificationService = inject(NotificationService)) => ({
    loadFunds: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() => fundService.getFunds().pipe(
          tap((funds) => patchState(store, { funds, loading: false }))
        ))
      )
    ),

    addFund(fund: Omit<Fund, 'id' | 'createdAt' | 'createdBy'>) {
      patchState(store, { saving: true });
      const newFund: Fund = {
        ...fund,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        createdBy: 'current_user',
      };
      
      fundService.addFund(newFund).subscribe((addedFund) => {
        patchState(store, {
          funds: [...store.funds(), addedFund],
          saving: false,
        });
        notificationService.success(`Fund '${addedFund.name}' created successfully.`);
      });
    },
    
    updateFund(id: string, updates: Partial<Fund>) {
      patchState(store, { saving: true });
      const updatesToSave = { ...updates, lastModifiedAt: new Date().toISOString() };
      
      fundService.updateFund(id, updatesToSave).subscribe((updatedFund) => {
        const currentFunds = store.funds();
        const updatedFunds = currentFunds.map((f) => f.id === id ? updatedFund : f);
        patchState(store, { funds: updatedFunds, saving: false });
        notificationService.success('Fund updated successfully.');
      });
    },
    
    deleteFund(id: string) {
      patchState(store, { saving: true });
      fundService.deleteFund(id).subscribe(() => {
        const currentFunds = store.funds();
        const filteredFunds = currentFunds.filter((fund) => fund.id !== id);
        patchState(store, { funds: filteredFunds, saving: false });
        notificationService.success('Fund deleted successfully.');
      });
    }
  }))
);
