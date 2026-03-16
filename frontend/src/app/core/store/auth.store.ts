import { computed, inject, Injectable } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { User, LoginRequest } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { tap, finalize, switchMap, pipe } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

type AuthState = {
  user: User | null;
  permissions: string[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  permissions: [],
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    isAdmin: computed(() => user()?.email?.startsWith('admin') ?? false), // Simple check
    username: computed(() => user()?.firstName || 'Guest'),
    userAvatar: computed(() => user()?.avatarUrl),
  })),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      router = inject(Router),
      notificationService = inject(NotificationService),
    ) => ({
      hasPermission(permissionName: string): boolean {
        return store.permissions().includes(permissionName);
      },
      hasAnyPermission(permissionNames: string[]): boolean {
        return permissionNames.some((p) => store.permissions().includes(p));
      },
      login: rxMethod<LoginRequest>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((credentials) =>
            authService.login(credentials).pipe(
              tap({
                next: (response) => {
                  patchState(store, {
                    user: response.user,
                    permissions: response.permissions,
                    isAuthenticated: true,
                    loading: false,
                  });
                  notificationService.success(`Welcome back, ${response.user.firstName}!`);
                  router.navigate(['/directory']);
                },
                error: (err) => {
                  patchState(store, {
                    loading: false,
                    error: err.message || 'Login failed',
                    isAuthenticated: false,
                  });
                  notificationService.error(err.message || 'Login failed');
                },
              })
            )
          )
        )
      ),

      logout() {
        authService.logout();
        patchState(store, initialState);
        router.navigate(['/login']);
        notificationService.info('Logged out successfully');
      },

      // Method to check session on app load
      checkSession: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            authService.checkSession().pipe(
              tap((response) => {
                if (response) {
                  patchState(store, {
                    user: response.user,
                    permissions: response.permissions,
                    isAuthenticated: true,
                    loading: false,
                  });
                } else {
                  patchState(store, { loading: false, isAuthenticated: false });
                }
              }),
              finalize(() => patchState(store, { loading: false }))
            )
          )
        )
      ),
    }),
  ),
);
