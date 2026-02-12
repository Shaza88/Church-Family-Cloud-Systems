import { Routes } from '@angular/router';
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
];
