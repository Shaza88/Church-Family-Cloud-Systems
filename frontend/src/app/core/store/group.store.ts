import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Group } from '../models/group.model';
import { tap, switchMap, pipe } from 'rxjs';
import { GroupService } from '../services/group.service';
import { SortDirection } from '../models/query.model';
import { NotificationService } from '../services/notification.service';
import { AuthStore } from './auth.store';

type GroupState = {
  groups: Group[];
  allGroups: Group[];
  total: number;
  loading: boolean;
  filter: string;
  selectedGroup: Group | null;
  pageIndex: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: SortDirection;
};

const initialState: GroupState = {
  groups: [],
  allGroups: [],
  total: 0,
  loading: false,
  filter: '',
  selectedGroup: null,
  pageIndex: 0,
  pageSize: 10,
  sortColumn: 'name',
  sortDirection: 'asc',
};

export const GroupStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => {
    const groupService = inject(GroupService);
    const notificationService = inject(NotificationService);
    const authStore = inject(AuthStore);

    return {
      loadGroups: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() => {
            const query = {
              pageIndex: store.pageIndex(),
              pageSize: store.pageSize(),
              search: store.filter(),
              sort: {
                active: store.sortColumn(),
                direction: store.sortDirection(),
              },
            };
            return groupService.getGroups(query).pipe(
              tap((response) =>
                patchState(store, {
                  groups: response.items,
                  total: response.total,
                  loading: false,
                })
              )
            );
          })
        )
      ),
      loadAllGroups: rxMethod<void>(
        pipe(
          switchMap(() => 
            groupService.getAllGroups().pipe(
              tap((groups) => patchState(store, { allGroups: groups }))
            )
          )
        )
      ),
      loadGroupById: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((id) =>
            groupService.getGroupById(id).pipe(
              tap((group) => {
                if (group) {
                  patchState(store, { selectedGroup: group, loading: false });
                } else {
                  patchState(store, { selectedGroup: null, loading: false });
                  notificationService.error('Group not found');
                }
              })
            )
          )
        )
      ),
    };
  }),

  withMethods((store) => {
    const groupService = inject(GroupService);
    const notificationService = inject(NotificationService);
    const authStore = inject(AuthStore);

    return {
      updateFilter(query: string) {
        patchState(store, { filter: query, pageIndex: 0 });
        store.loadGroups();
      },
      updatePage(pageIndex: number, pageSize: number) {
        patchState(store, { pageIndex, pageSize });
        store.loadGroups();
      },
      updateSort(sortColumn: string, sortDirection: SortDirection) {
        patchState(store, { sortColumn, sortDirection });
        store.loadGroups();
      },
      addGroup: rxMethod<Group>(
        pipe(
          switchMap((group) => {
            const currentUserEmail = authStore.user()?.email || 'system';
            const now = new Date().toISOString();
            const newGroup = {
              ...group,
              createdBy: currentUserEmail,
              createdAt: now,
              lastModifiedBy: currentUserEmail,
              lastModifiedAt: now,
            };

            return groupService.addGroup(newGroup).pipe(
              tap(() => {
                store.loadGroups();
                store.loadAllGroups();
                notificationService.success('Group created successfully');
              })
            );
          })
        )
      ),
      updateGroup: rxMethod<Group>(
        pipe(
          switchMap((updatedGroup) => {
            const currentUserEmail = authStore.user()?.email || 'system';
            const now = new Date().toISOString();
            const payload = {
              ...updatedGroup,
              lastModifiedBy: currentUserEmail,
              lastModifiedAt: now,
            };
            return groupService.updateGroup(payload).pipe(
              tap({
                next: (toSave) => {
                  if (store.selectedGroup()?.id === updatedGroup.id) {
                    patchState(store, { selectedGroup: toSave });
                  }
                  store.loadGroups();
                  store.loadAllGroups();
                  notificationService.success('Group updated successfully');
                },
                error: () => notificationService.error('Failed to update group')
              })
            );
          })
        )
      ),
      deleteGroup: rxMethod<string>(
        pipe(
          switchMap((id) => {
            return groupService.deleteGroup(id).pipe(
              tap(() => {
                store.loadGroups();
                store.loadAllGroups();
                notificationService.success('Group deleted');
              })
            );
          })
        )
      )
    };
  })
);
