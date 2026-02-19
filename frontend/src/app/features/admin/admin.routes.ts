import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { RoleManagementComponent } from './roles/role-management.component';
import { UserManagementComponent } from './users/user-management.component';
import { permissionGuard } from '../../core/guards/permission.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [permissionGuard('roles.view')], // Ensure user can at least view admin area
  },
  {
    path: 'roles',
    component: RoleManagementComponent,
    canActivate: [permissionGuard('roles.view')],
  },
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [permissionGuard('roles.view')], // Assuming same permission for now, or use 'users.manage' if available
  },
];
