import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MOCK_PERMISSIONS } from '../../../core/data/mock-auth';
import { Permission, Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
  ],
  templateUrl: './role-dialog.component.html',
})
export class RoleDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<RoleDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  form: FormGroup;
  permissions = MOCK_PERMISSIONS;

  // Group permissions by 'group' property
  permissionGroups = this.groupPermissions(this.permissions);
  groupKeys = Object.keys(this.permissionGroups);

  constructor() {
    const role: Role | null = this.data.role;

    this.form = this.fb.group({
      name: [role?.name || '', Validators.required],
      description: [role?.description || '', Validators.required],
      permissionIds: [role?.permissionIds || []],
    });
  }

  isPermissionSelected(permId: string): boolean {
    const selected = this.form.get('permissionIds')?.value as string[];
    return selected.includes(permId);
  }

  togglePermission(permId: string) {
    const current = this.form.get('permissionIds')?.value as string[];
    const index = current.indexOf(permId);

    if (index === -1) {
      this.form.patchValue({ permissionIds: [...current, permId] });
    } else {
      this.form.patchValue({ permissionIds: current.filter((id) => id !== permId) });
    }

    this.form.markAsDirty();
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  private groupPermissions(permissions: Permission[]): Record<string, Permission[]> {
    return permissions.reduce(
      (groups, perm) => {
        if (!groups[perm.group]) {
          groups[perm.group] = [];
        }
        groups[perm.group].push(perm);
        return groups;
      },
      {} as Record<string, Permission[]>,
    );
  }
}
