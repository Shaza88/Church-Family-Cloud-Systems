import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Household } from '../models/household.model';
import { computed } from '@angular/core';
import { delay, of, tap } from 'rxjs';
import { MOCK_HOUSEHOLDS } from '../data/mock-households';

type HouseholdState = {
  households: Household[];
  loading: boolean;
  filter: string;
};

const initialState: HouseholdState = {
  households: [],
  loading: false,
  filter: '',
};

export const HouseholdStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ households, filter }) => ({
    filteredHouseholds: computed(() => {
      const currentFilter = filter().toLowerCase();
      return households().filter((h) => {
        const searchStr = (
          h.name +
          h.status +
          h.address +
          h.members.map((m) => m.firstName + ' ' + m.lastName).join(' ')
        ).toLowerCase();
        return searchStr.includes(currentFilter);
      });
    }),
  })),

  withMethods((store) => ({
    loadHouseholds() {
      patchState(store, { loading: true });
      of(MOCK_HOUSEHOLDS)
        .pipe(
          delay(800),
          tap((data) => patchState(store, { households: data, loading: false })),
        )
        .subscribe();
    },
    updateFilter(query: string) {
      patchState(store, { filter: query });
    },
  })),
);
