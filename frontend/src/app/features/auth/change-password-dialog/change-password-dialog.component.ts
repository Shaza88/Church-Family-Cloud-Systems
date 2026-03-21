import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Change Password</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-4">
        <mat-form-field appearance="outline">
          <mat-label>Current Password</mat-label>
          <input matInput [type]="hideOld ? 'password' : 'text'" formControlName="oldPassword" />
          <button
            mat-icon-button
            matSuffix
            (click)="hideOld = !hideOld"
            [attr.aria-label]="'Hide password'"
          >
            <mat-icon>{{ hideOld ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (form.get('oldPassword')?.hasError('required')) {
            <mat-error>Required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>New Password</mat-label>
          <input matInput [type]="hideNew ? 'password' : 'text'" formControlName="newPassword" />
          <button
            mat-icon-button
            matSuffix
            (click)="hideNew = !hideNew"
            [attr.aria-label]="'Hide password'"
          >
            <mat-icon>{{ hideNew ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (form.get('newPassword')?.hasError('required')) {
            <mat-error>Required</mat-error>
          }
          @if (form.get('newPassword')?.hasError('minlength')) {
            <mat-error>Minimum 6 characters</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Confirm New Password</mat-label>
          <input
            matInput
            [type]="hideConfirm ? 'password' : 'text'"
            formControlName="confirmPassword"
          />
          <button
            mat-icon-button
            matSuffix
            (click)="hideConfirm = !hideConfirm"
            [attr.aria-label]="'Hide password'"
          >
            <mat-icon>{{ hideConfirm ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (form.hasError('mismatch')) {
            <mat-error>Passwords do not match</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-flat-button
        color="primary"
        (click)="submit()"
        [disabled]="form.invalid || loading()"
      >
        @if (!loading()) {
          <span>Change Password</span>
        } @else {
          <span>Saving...</span>
        }
      </button>
    </mat-dialog-actions>
  `,
})
export class ChangePasswordDialogComponent {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  dialogRef = inject(MatDialogRef);

  form = new FormGroup(
    {
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator },
  );

  loading = signal(false);
  hideOld = true;
  hideNew = true;
  hideConfirm = true;

  passwordMatchValidator(g: AbstractControl) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  submit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    const { oldPassword, newPassword } = this.form.value;

    this.authService.changePassword(oldPassword!, newPassword!).subscribe({
      next: () => {
        this.notificationService.success('Password changed successfully');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to change password');
        this.loading.set(false);
      },
    });
  }
}
