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
];
