import { Routes } from '@angular/router';

export const COMMUNICATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./broadcast-form/broadcast-form.component').then((m) => m.BroadcastFormComponent),
  }
];
