import { Routes } from '@angular/router';

export const TAX_STATEMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./tax-statement.component').then((m) => m.TaxStatementComponent),
  },
];
