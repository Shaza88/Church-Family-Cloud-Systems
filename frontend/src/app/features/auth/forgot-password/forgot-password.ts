import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
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
            class="bg-blue-100 flex items-center justify-center rounded-full text-blue-600"
          >
            <mat-icon>lock_reset</mat-icon>
          </div>
          <mat-card-title>Forgot Password</mat-card-title>
          <mat-card-subtitle>Enter your email to reset your password</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="flex flex-col gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Email Address</mat-label>
              <input
                matInput
                [formControl]="emailControl"
                placeholder="user@example.com"
                (keyup.enter)="submit()"
              />
              @if (emailControl.hasError('required')) {
                <mat-error>Email is required</mat-error>
              }
              @if (emailControl.hasError('email')) {
                <mat-error>Invalid email address</mat-error>
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
            [disabled]="loading() || emailControl.invalid"
            class="w-full sm:w-auto"
          >
            @if (!loading()) {
              <span>Send Reset Link</span>
            } @else {
              <span>Sending...</span>
            }
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [],
})
export class ForgotPasswordComponent {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  emailControl = new FormControl('', [Validators.required, Validators.email]);
  loading = signal(false);

  submit() {
    if (this.emailControl.invalid) return;

    this.loading.set(true);
    const email = this.emailControl.value!;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.notificationService.success('If the email exists, a reset link has been sent.');
        this.loading.set(false);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.notificationService.error('An error occurred. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
