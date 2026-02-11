import { computed, inject, Injectable } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { LookupType, LookupValue } from '../models/lookup.model';
import { NotificationService } from '../services/notification.service';

type LookupState = {
  items: LookupValue[];
  loading: boolean;
  error: string | null;
};

const initialState: LookupState = {
  items: [
    // Initial Mock Data
    { id: '1', type: 'Gender', value: 'Male' },
    { id: '2', type: 'Gender', value: 'Female' },
    { id: '3', type: 'HouseholdStatus', value: 'Active' },
    { id: '4', type: 'HouseholdStatus', value: 'Visitor' },
    { id: '5', type: 'HouseholdStatus', value: 'Inactive' },
    { id: '6', type: 'Profession', value: 'Engineer' },
    { id: '7', type: 'Profession', value: 'Teacher' },
    { id: '8', type: 'Profession', value: 'Doctor' },
    { id: '9', type: 'Profession', value: 'Nurse' },
    { id: '10', type: 'Profession', value: 'Student' },
    { id: '11', type: 'Profession', value: 'Retired' },
  ],
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
  })),
  withMethods((store, notificationService = inject(NotificationService)) => ({
    addLookup(type: LookupType, value: string) {
      const currentItems = store.items();
      const normalizedValue = value.trim();

      // Check for duplicates (case-insensitive)
      const exists = currentItems.some(
        (i) => i.type === type && i.value.toLowerCase() === normalizedValue.toLowerCase(),
      );

      if (exists) {
        // Return existing item ID if needed, or just return
        return;
      }

      const newItem: LookupValue = {
        id: crypto.randomUUID(),
        type,
        value: normalizedValue,
      };

      patchState(store, { items: [...currentItems, newItem] });
      notificationService.success(`${type} '${normalizedValue}' added.`);
    },

    updateLookup(id: string, newValue: string) {
      const currentItems = store.items();
      const updatedItems = currentItems.map((item) =>
        item.id === id ? { ...item, value: newValue.trim() } : item,
      );
      patchState(store, { items: updatedItems });
      notificationService.success('Lookup updated successfully.');
    },

    deleteLookup(id: string) {
      const currentItems = store.items();
      const filteredItems = currentItems.filter((item) => item.id !== id);
      patchState(store, { items: filteredItems });
      notificationService.success('Lookup deleted successfully.');
    },
  })),
);
