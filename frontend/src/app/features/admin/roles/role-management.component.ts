import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MOCK_ROLES } from '../../../core/data/mock-auth';
import { Role } from '../../../core/models/user.model';
import { RoleDialogComponent } from './role-dialog.component';
import { NotificationService } from '../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDialogModule,
    MatTooltipModule,
    PageHeaderComponent,
  ],
  templateUrl: './role-management.component.html',
})
export class RoleManagementComponent {
  dialog = inject(MatDialog);
  notificationService = inject(NotificationService);

  // In a real app, this would be in a store
  roles = signal<Role[]>(MOCK_ROLES);

  displayedColumns = ['name', 'description', 'permissions', 'actions'];

  addRole() {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '600px',
      data: { role: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.roles.update((roles) => [...roles, { ...result, id: crypto.randomUUID() }]);
        this.notificationService.success('Role added successfully');
      }
    });
  }

  editRole(role: Role) {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '600px',
      data: { role: { ...role } }, // Clone to avoid mutation
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.roles.update((roles) =>
          roles.map((r) => (r.id === role.id ? { ...result, id: role.id } : r)),
        );
        this.notificationService.success('Role updated successfully');
      }
    });
  }

  deleteRole(role: Role) {
    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      this.roles.update((roles) => roles.filter((r) => r.id !== role.id));
      this.notificationService.success('Role deleted successfully');
    }
  }
}
