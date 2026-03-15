import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Household } from '../models/household.model';
import { tap } from 'rxjs';
import { HouseholdService } from '../services/household.service';
import { SortDirection } from '../models/query.model';
import { inject } from '@angular/core';
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
    const notificationService = inject(NotificationService);
    const authStore = inject(AuthStore);
    const householdService = inject(HouseholdService);

    return {
      loadHouseholds() {
        patchState(store, { loading: true });
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

        householdService.getHouseholds(query)
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
      loadHousehold(id: string) {
        patchState(store, { loading: true });
        householdService.getHouseholdById(id).subscribe((household) => {
          if (household) {
            patchState(store, { selectedHousehold: household, loading: false });
          } else {
            patchState(store, { selectedHousehold: null, loading: false });
            notificationService.error('Household not found');
          }
        });
      },
      setSelectedHousehold(household: Household | null) {
        patchState(store, { selectedHousehold: household });
      },
      updateFilter(query: string) {
        patchState(store, { filter: query, pageIndex: 0 });
        this.loadHouseholds();
      },
      updateAdvancedFilter(filters: any) {
        patchState(store, { advancedFilter: filters, pageIndex: 0 });
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
        const currentUserEmail = authStore.user()?.email || 'system';
        const now = new Date().toISOString();
        const newHousehold = {
          ...household,
          createdBy: currentUserEmail,
          createdAt: now,
          lastModifiedBy: currentUserEmail,
          lastModifiedAt: now,
        };

        householdService.addHousehold(newHousehold).subscribe(() => {
          this.loadHouseholds();
          notificationService.success('Household added successfully');
        });
      },
      updateHousehold(updatedHousehold: Household) {
        const currentUserEmail = authStore.user()?.email || 'system';
        const now = new Date().toISOString();

        householdService.updateHousehold(updatedHousehold).subscribe({
          next: (toSave) => {
            // Update selected household if it's the one being edited
            if (store.selectedHousehold()?.id === updatedHousehold.id) {
              patchState(store, { selectedHousehold: toSave });
            }
            this.loadHouseholds();
            notificationService.success('Household updated successfully');
          },
          error: () => notificationService.error('Failed to update household')
        });
      },
    };
  }),
);
