import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Household } from '../models/household.model';
import { tap, switchMap, pipe } from 'rxjs';
import { HouseholdService } from '../services/household.service';
import { SortDirection } from '../models/query.model';
import { NotificationService } from '../services/notification.service';
import { AuthStore } from './auth.store';

type HouseholdState = {
  households: Household[];
  total: number;
  loading: boolean;
  filter: string;
  advancedFilter: {
    status?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    profession?: string | null;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
    zip?: string | null;
  } | null;
  selectedHousehold: Household | null;
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
  advancedFilter: null,
  selectedHousehold: null,
  pageIndex: 0,
  pageSize: 10,
  sortColumn: '',
  sortDirection: '',
};

export const HouseholdStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => {
    const householdService = inject(HouseholdService);
    const notificationService = inject(NotificationService);

    return {
      loadHouseholds: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() => {
            const query = {
              pageIndex: store.pageIndex(),
              pageSize: store.pageSize(),
              search: store.filter(),
              filters: store.advancedFilter() || undefined,
              sort: {
                active: store.sortColumn(),
                direction: store.sortDirection(),
              },
            };
            return householdService.getHouseholds(query).pipe(
              tap((response) =>
                patchState(store, {
                  households: response.items,
                  total: response.total,
                  loading: false,
                })
              )
            );
          })
        )
      ),
      loadHousehold: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((id) =>
            householdService.getHouseholdById(id).pipe(
              tap((household) => {
                if (household) {
                  patchState(store, { selectedHousehold: household, loading: false });
                } else {
                  patchState(store, { selectedHousehold: null, loading: false });
                  notificationService.error('Household not found');
                }
              })
            )
          )
        )
      ),
      setSelectedHousehold(household: Household | null) {
        patchState(store, { selectedHousehold: household });
      },
    };
  }),

  withMethods((store) => {
    const notificationService = inject(NotificationService);
    const authStore = inject(AuthStore);
    const householdService = inject(HouseholdService);

    return {
      updateFilter(query: string) {
        patchState(store, { filter: query, pageIndex: 0 });
        store.loadHouseholds();
      },
      updateAdvancedFilter(filters: any) {
        patchState(store, { advancedFilter: filters, pageIndex: 0 });
        store.loadHouseholds();
      },
      updatePage(pageIndex: number, pageSize: number) {
        patchState(store, { pageIndex, pageSize });
        store.loadHouseholds();
      },
      updateSort(sortColumn: string, sortDirection: SortDirection) {
        patchState(store, { sortColumn, sortDirection });
        store.loadHouseholds();
      },
      addHousehold: rxMethod<Household>(
        pipe(
          switchMap((household) => {
            const currentUserEmail = authStore.user()?.email || 'system';
            const now = new Date().toISOString();
            const newHousehold = {
              ...household,
              createdBy: currentUserEmail,
              createdAt: now,
              lastModifiedBy: currentUserEmail,
              lastModifiedAt: now,
            };

            return householdService.addHousehold(newHousehold).pipe(
              tap(() => {
                store.loadHouseholds();
                notificationService.success('Household added successfully');
              })
            );
          })
        )
      ),
      updateHousehold: rxMethod<Household>(
        pipe(
          switchMap((updatedHousehold) => {
            return householdService.updateHousehold(updatedHousehold).pipe(
              tap({
                next: (toSave) => {
                  if (store.selectedHousehold()?.id === updatedHousehold.id) {
                    patchState(store, { selectedHousehold: toSave });
                  }
                  store.loadHouseholds();
                  notificationService.success('Household updated successfully');
                },
                error: () => notificationService.error('Failed to update household')
              })
            );
          })
        )
      ),
    };
  })
);
