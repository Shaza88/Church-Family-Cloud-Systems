import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { User, Role } from '../../../core/models/user.model';
import { RolePermissionService } from '../../../core/services/role-permission.service';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './user-dialog.component.html',
})
export class UserDialogComponent {
  fb = inject(FormBuilder);
  rolePermissionService = inject(RolePermissionService);
  form: FormGroup;
  roles: Role[] = [];

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User },
  ) {
    this.rolePermissionService.getRoles().subscribe(roles => this.roles = roles);

    this.form = this.fb.group({
      id: [data.user?.id || null],
      email: [data.user?.email || '', [Validators.required, Validators.email]],
      firstName: [data.user?.firstName || '', Validators.required],
      lastName: [data.user?.lastName || '', Validators.required],
      phone: [data.user?.phone || ''],
      roles: [data.user?.roles || [], Validators.required],
      address: this.fb.group({
        street: [data.user?.address?.street || ''],
        city: [data.user?.address?.city || ''],
        state: [data.user?.address?.state || ''],
        zip: [data.user?.address?.zip || ''],
      }),
    });
  }

  save() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }
}
