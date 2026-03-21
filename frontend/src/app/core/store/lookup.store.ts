import { computed, inject, Injectable } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { LookupType, LookupValue } from '../models/lookup.model';
import { NotificationService } from '../services/notification.service';
import { LookupService } from '../services/lookup.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap } from 'rxjs';

type LookupState = {
  items: LookupValue[];
  loading: boolean;
  error: string | null;
};

const initialState: LookupState = {
  items: [],
  loading: false,
  error: null,
};

export const LookupStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ items }) => ({
    genders: computed(() => items().filter((i) => i.type === 'Gender')),
    statuses: computed(() => items().filter((i) => i.type === 'HouseholdStatus')),
    professions: computed(() => items().filter((i) => i.type === 'Profession')),
    relationships: computed(() => items().filter((i) => i.type === 'Relationship')),
    householdRelationshipTypes: computed(() =>
      items().filter((i) => i.type === 'HouseholdRelationshipType'),
    ),
  })),
  withMethods((store, lookupService = inject(LookupService), notificationService = inject(NotificationService)) => ({
    loadLookups: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => lookupService.getLookups().pipe(
          tap({
            next: (items) => patchState(store, { items, loading: false }),
            error: (err) => {
              patchState(store, { loading: false, error: err.message || 'Failed to load lookups.' });
              notificationService.error('Failed to load lookups.');
            }
          })
        ))
      )
    ),

    addLookup(type: LookupType, value: string) {
      const currentItems = store.items();
      const normalizedValue = value.trim();

      // Check for duplicates (case-insensitive) locally first
      const exists = currentItems.some(
        (i) => i.type === type && i.value.toLowerCase() === normalizedValue.toLowerCase(),
      );

      if (exists) {
        return;
      }

      patchState(store, { loading: true, error: null });
      const newItem: LookupValue = {
        id: crypto.randomUUID(),
        type,
        value: normalizedValue,
      };

      lookupService.addLookup(newItem).subscribe({
        next: (added) => {
          patchState(store, { items: [...store.items(), added], loading: false });
          notificationService.success(`${type} '${normalizedValue}' added.`);
        },
        error: (err) => {
          patchState(store, { loading: false, error: err.message || `Failed to add ${type}.` });
          notificationService.error(`Failed to add ${type}.`);
        }
      });
    },

    updateLookup(id: string, newValue: string) {
      patchState(store, { loading: true, error: null });
      lookupService.updateLookup(id, { value: newValue.trim() }).subscribe({
        next: (updated) => {
          const updatedItems = store.items().map((item) => item.id === id ? updated : item);
          patchState(store, { items: updatedItems, loading: false });
          notificationService.success('Lookup updated successfully.');
        },
        error: (err) => {
          patchState(store, { loading: false, error: err.message || 'Failed to update lookup.' });
          notificationService.error('Failed to update lookup.');
        }
      });
    },

    deleteLookup(id: string) {
      patchState(store, { loading: true, error: null });
      lookupService.deleteLookup(id).subscribe({
        next: () => {
          const filteredItems = store.items().filter((item) => item.id !== id);
          patchState(store, { items: filteredItems, loading: false });
          notificationService.success('Lookup deleted successfully.');
        },
        error: (err) => {
          patchState(store, { loading: false, error: err.message || 'Failed to delete lookup.' });
          notificationService.error('Failed to delete lookup.');
        }
      });
    },
  })),
);
