import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';
import { HouseholdDirectoryComponent } from './household-directory/household-directory';
import { HouseholdDetailComponent } from './household-detail/household-detail.component';

export const DIRECTORY_ROUTES: Routes = [
  {
    path: '',
    component: HouseholdDirectoryComponent,
  },
  {
    path: 'new',
    component: HouseholdDetailComponent,
  },
  {
    path: ':id',
    component: HouseholdDetailComponent,
  },
  {
    path: ':id/tax-statement',
    canActivate: [permissionGuard('taxstatements.view')],
    loadChildren: () => import('./household-detail/tax-statement/tax-statement.routes').then((m) => m.TAX_STATEMENT_ROUTES),
  },
];
