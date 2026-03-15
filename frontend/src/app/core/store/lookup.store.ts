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
        tap(() => patchState(store, { loading: true })),
        switchMap(() => lookupService.getLookups().pipe(
          tap((items) => patchState(store, { items, loading: false }))
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

      patchState(store, { loading: true });
      const newItem: LookupValue = {
        id: crypto.randomUUID(),
        type,
        value: normalizedValue,
      };

      lookupService.addLookup(newItem).subscribe((added) => {
        patchState(store, { items: [...store.items(), added], loading: false });
        notificationService.success(`${type} '${normalizedValue}' added.`);
      });
    },

    updateLookup(id: string, newValue: string) {
      patchState(store, { loading: true });
      lookupService.updateLookup(id, { value: newValue.trim() }).subscribe((updated) => {
        const updatedItems = store.items().map((item) => item.id === id ? updated : item);
        patchState(store, { items: updatedItems, loading: false });
        notificationService.success('Lookup updated successfully.');
      });
    },

    deleteLookup(id: string) {
      patchState(store, { loading: true });
      lookupService.deleteLookup(id).subscribe(() => {
        const filteredItems = store.items().filter((item) => item.id !== id);
        patchState(store, { items: filteredItems, loading: false });
        notificationService.success('Lookup deleted successfully.');
      });
    },
  })),
);
