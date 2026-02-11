import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Household } from '../models/household.model';
import { tap } from 'rxjs';
import { getHouseholds } from '../data/mock-households';
import { SortDirection } from '../models/query.model';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';

type HouseholdState = {
  households: Household[];
  total: number;
  loading: boolean;
  filter: string;
  pageIndex: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: SortDirection;
};

const initialState: HouseholdState = {
  households: [],
  total: 0,
  loading: false,
  filter: '',
  pageIndex: 0,
  pageSize: 10,
  sortColumn: '',
  sortDirection: '',
};

export const HouseholdStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => {
    const notificationService = inject(NotificationService);
    return {
      loadHouseholds() {
        patchState(store, { loading: true });
        const query = {
          pageIndex: store.pageIndex(),
          pageSize: store.pageSize(),
          search: store.filter(),
          sort: {
            active: store.sortColumn(),
            direction: store.sortDirection(),
          },
        };

        getHouseholds(query)
          .pipe(
            tap((response) =>
              patchState(store, {
                households: response.items,
                total: response.total,
                loading: false,
              }),
            ),
          )
          .subscribe();
      },
      updateFilter(query: string) {
        patchState(store, { filter: query, pageIndex: 0 });
        this.loadHouseholds();
      },
      updatePage(pageIndex: number, pageSize: number) {
        patchState(store, { pageIndex, pageSize });
        this.loadHouseholds();
      },
      updateSort(sortColumn: string, sortDirection: SortDirection) {
        patchState(store, { sortColumn, sortDirection });
        this.loadHouseholds();
      },
      addHousehold(household: Household) {
        import('../data/mock-households').then((mod) => {
          mod.MOCK_HOUSEHOLDS.push(household);
          this.loadHouseholds();
          notificationService.success('Household added successfully');
        });
      },
      updateHousehold(updatedHousehold: Household) {
        import('../data/mock-households').then((mod) => {
          const index = mod.MOCK_HOUSEHOLDS.findIndex((h) => h.id === updatedHousehold.id);
          if (index !== -1) {
            mod.MOCK_HOUSEHOLDS[index] = updatedHousehold;
            this.loadHouseholds();
            notificationService.success('Household updated successfully');
          }
        });
      },
    };
  }),
);
