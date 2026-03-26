import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Group } from '../../../core/models/group.model';

@Component({
  selector: 'app-group-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title class="m-0 border-b border-gray-100 pb-4">
      {{ data.group ? 'Edit Ministry Group' : 'New Ministry Group' }}
    </h2>
    <mat-dialog-content class="!pt-6">
      <form [formGroup]="form" class="flex flex-col gap-4">
        <mat-form-field appearance="outline">
          <mat-label>Group Name</mat-label>
          <input matInput formControlName="name" placeholder="e.g. Adult Choir" />
          @if (form.get('name')?.hasError('required')) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Meeting Time</mat-label>
          <input matInput formControlName="meetingTime" placeholder="e.g. Sundays at 9:00 AM" />
          @if (form.get('meetingTime')?.hasError('required')) {
            <mat-error>Meeting time is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Describe the group's purpose..."></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="border-t border-gray-100 !px-6 !py-3">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid || form.pristine">
        Save Group
      </button>
    </mat-dialog-actions>
  `
})
export class GroupDialogComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<GroupDialogComponent>);
  
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { group?: Group }) {
    this.form = this.fb.group({
      name: [data.group?.name || '', Validators.required],
      meetingTime: [data.group?.meetingTime || '', Validators.required],
      description: [data.group?.description || '']
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
