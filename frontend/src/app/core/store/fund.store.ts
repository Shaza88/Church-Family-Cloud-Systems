import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Fund } from '../models/fund.model';
import { MOCK_FUNDS } from '../data/mock-funds';
import { NotificationService } from '../services/notification.service';

type FundState = {
  funds: Fund[];
  loading: boolean;
  saving: boolean;
  error: string | null;
};

const initialState: FundState = {
  funds: MOCK_FUNDS,
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
  withMethods((store, notificationService = inject(NotificationService)) => ({
    addFund(fund: Omit<Fund, 'id' | 'createdAt' | 'createdBy'>) {
      patchState(store, { saving: true });
      
      // Simulate API call delay
      setTimeout(() => {
        const newFund: Fund = {
          ...fund,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          createdBy: 'current_user',
        };
        
        patchState(store, {
          funds: [...store.funds(), newFund],
          saving: false,
        });
        
        notificationService.success(`Fund '${newFund.name}' created successfully.`);
      }, 500);
    },
    
    updateFund(id: string, updates: Partial<Fund>) {
      patchState(store, { saving: true });
      
      setTimeout(() => {
        const currentFunds = store.funds();
        const updatedFunds = currentFunds.map((fund) =>
          fund.id === id 
            ? { ...fund, ...updates, lastModifiedAt: new Date().toISOString() } 
            : fund
        );
        
        patchState(store, { funds: updatedFunds, saving: false });
        notificationService.success('Fund updated successfully.');
      }, 500);
    },
    
    deleteFund(id: string) {
      patchState(store, { saving: true });
      
      setTimeout(() => {
        const currentFunds = store.funds();
        const filteredFunds = currentFunds.filter((fund) => fund.id !== id);
        
        patchState(store, { funds: filteredFunds, saving: false });
        notificationService.success('Fund deleted successfully.');
      }, 500);
    }
  }))
);
