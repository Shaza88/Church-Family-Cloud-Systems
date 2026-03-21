import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-setup-password',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <mat-card class="max-w-md w-full p-6 shadow-xl">
        <mat-card-header class="mb-4">
          <div
            mat-card-avatar
            class="bg-green-100 flex items-center justify-center rounded-full text-green-600"
          >
            <mat-icon>lock</mat-icon>
          </div>
          <mat-card-title>Set Password</mat-card-title>
          <mat-card-subtitle>Create a secure password for your account</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content [formGroup]="form">
          <div class="flex flex-col gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>New Password</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
              />
              <button
                mat-icon-button
                matSuffix
                (click)="hidePassword = !hidePassword"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hidePassword"
              >
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.get('password')?.hasError('required')) {
                <mat-error>Password is required</mat-error>
              }
              @if (form.get('password')?.hasError('minlength')) {
                <mat-error>Must be at least 6 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Confirm Password</mat-label>
              <input
                matInput
                [type]="hideConfirm ? 'password' : 'text'"
                formControlName="confirmPassword"
                (keyup.enter)="submit()"
              />
              <button
                mat-icon-button
                matSuffix
                (click)="hideConfirm = !hideConfirm"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hideConfirm"
              >
                <mat-icon>{{ hideConfirm ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.hasError('mismatch')) {
                <mat-error>Passwords do not match</mat-error>
              }
            </mat-form-field>
          </div>
        </mat-card-content>

        <mat-card-actions align="end" class="flex flex-col sm:flex-row gap-2">
          <button mat-button routerLink="/login" class="w-full sm:w-auto">Back to Login</button>
          <button
            mat-flat-button
            color="primary"
            (click)="submit()"
            [disabled]="loading() || form.invalid"
            class="w-full sm:w-auto"
          >
            @if (!loading()) {
              <span>Set Password</span>
            } @else {
              <span>Saving...</span>
            }
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [],
})
export class SetupPasswordComponent implements OnInit {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  form = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator },
  );

  loading = signal(false);
  token: string | null = null;
  hidePassword = true;
  hideConfirm = true;

  ngOnInit() {
    this.authService.logout(); // Ensure we are fresh
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log('[SetupPassword] Token from URL:', this.token);
    if (!this.token) {
      this.notificationService.error('Invalid link. Please request a new one.');
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(g: AbstractControl) {
    // Changed type to AbstractControl
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  submit() {
    if (this.form.invalid || !this.token) return;

    this.loading.set(true);
    const password = this.form.get('password')?.value!;

    this.authService.setupPassword(this.token, password).subscribe({
      next: () => {
        this.notificationService.success('Password set successfully. Please login.');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.notificationService.error('Invalid or expired token.');
        this.loading.set(false);
      },
    });
  }
}
