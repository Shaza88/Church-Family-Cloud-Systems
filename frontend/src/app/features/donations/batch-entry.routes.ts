import { Routes } from '@angular/router';

export const BATCH_ENTRY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./batch-entry/batch-entry.component').then((m) => m.BatchEntryComponent),
  },
];
