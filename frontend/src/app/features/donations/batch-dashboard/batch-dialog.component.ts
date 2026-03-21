import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-batch-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <h2 mat-dialog-title>Create New Batch</h2>
    
    <mat-dialog-content class="pt-4">
      <form [formGroup]="batchForm" class="flex flex-col gap-4">
        <mat-form-field appearance="outline">
          <mat-label>Batch Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="batchForm.get('date')?.hasError('required')">
            Date is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Expected Total Deposit</mat-label>
          <span matTextPrefix>$&nbsp;</span>
          <input matInput type="number" formControlName="expectedTotal" placeholder="0.00" step="0.01">
          <mat-error *ngIf="batchForm.get('expectedTotal')?.hasError('required')">
            Expected Total is required
          </mat-error>
          <mat-error *ngIf="batchForm.get('expectedTotal')?.hasError('min')">
            Total must be greater than 0
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="!batchForm.valid" (click)="onSubmit()">
        Create Batch
      </button>
    </mat-dialog-actions>
  `,
})
export class BatchDialogComponent {
  dialogRef = inject(MatDialogRef<BatchDialogComponent>);
  fb = inject(FormBuilder);

  batchForm: FormGroup = this.fb.group({
    date: [new Date(), Validators.required],
    expectedTotal: [null, [Validators.required, Validators.min(0.01)]],
  });

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.batchForm.valid) {
      const data = this.batchForm.value;
      this.dialogRef.close({
        date: new Date(data.date).toISOString(),
        expectedTotal: Number(data.expectedTotal),
      });
    }
  }
}
