import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserDialogComponent } from './user-dialog.component';
import { RolePermissionService } from '../../../core/services/role-permission.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    PageHeaderComponent,
    HasPermissionDirective,
    EmptyStateComponent,
  ],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  dialog = inject(MatDialog);
  rolePermissionService = inject(RolePermissionService);

  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<User>();
  loading = signal(false);
  
  roles: import('../../../core/models/user.model').Role[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.rolePermissionService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load users');
        this.loading.set(false);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openUserDialog(user?: User) {
    const isNewUser = !user;
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      data: { user },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading.set(true);
        this.authService.saveUser(result).subscribe({
          next: (savedUser) => {
            if (isNewUser) {
              // Invite the new user
              this.authService.inviteUser(savedUser).subscribe({
                next: () => {
                  this.notificationService.success('User created & invite sent');
                  this.loadUsers();
                },
                error: () => {
                  this.notificationService.warning('User created but failed to send invite');
                  this.loadUsers();
                },
              });
            } else {
              this.notificationService.success('User saved successfully');
              this.loadUsers();
            }
          },
          error: () => {
            this.notificationService.error('Failed to save user');
            this.loading.set(false);
          },
        });
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete ${user.email}?`)) {
      this.loading.set(true);
      this.authService.deleteUser(user.id).subscribe({
        next: () => {
          this.notificationService.success('User deleted');
          this.loadUsers();
        },
        error: () => {
          this.notificationService.error('Failed to delete user');
          this.loading.set(false);
        },
      });
    }
  }

  getRoleName(roleId: string): string {
    const role = this.roles.find((r) => r.id === roleId);
    return role ? role.name : roleId;
  }
}
