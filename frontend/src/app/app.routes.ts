import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'directory',
    pathMatch: 'full',
  },
  {
    path: 'directory',
    loadChildren: () =>
      import('./features/directory/directory.routes').then((m) => m.DIRECTORY_ROUTES),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/dashboard/settings-dashboard.component').then(
        (m) => m.SettingsDashboardComponent,
      ),
  },
  {
    path: 'settings/lookups',
    loadComponent: () =>
      import('./features/settings/lookups/lookup-management.component').then(
        (m) => m.LookupManagementComponent,
      ),
  },
];
