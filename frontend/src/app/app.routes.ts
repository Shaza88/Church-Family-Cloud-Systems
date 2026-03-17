import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'auth/setup-password',
    loadComponent: () =>
      import('./features/auth/setup-password/setup-password').then((m) => m.SetupPasswordComponent),
  },
  {
    path: 'auth/reset-password',
    loadComponent: () =>
      import('./features/auth/setup-password/setup-password').then((m) => m.SetupPasswordComponent),
  },
  {
    path: 'directory',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/directory/directory.routes').then((m) => m.DIRECTORY_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/settings/dashboard/settings-dashboard.component').then(
        (m) => m.SettingsDashboardComponent,
      ),
  },
  {
    path: 'settings/lookups',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/settings/lookups/lookup-management.component').then(
        (m) => m.LookupManagementComponent,
      ),
  },
  {
    path: 'settings/funds',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/settings/funds/fund-management.component').then(
        (m) => m.FundManagementComponent,
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'donations/batch-entry',
    canActivate: [authGuard],
    loadChildren: () => import('./features/donations/batch-entry.routes').then((m) => m.BATCH_ENTRY_ROUTES),
  },
];
