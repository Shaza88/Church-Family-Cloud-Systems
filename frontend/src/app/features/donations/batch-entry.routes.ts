import { Routes } from '@angular/router';

export const BATCH_ENTRY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./batch-dashboard/batch-dashboard.component').then((m) => m.BatchDashboardComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./batch-entry/batch-entry.component').then((m) => m.BatchEntryComponent),
  },
];
