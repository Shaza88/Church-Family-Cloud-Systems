import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FundStore } from '../../../core/store/fund.store';
import { Fund } from '../../../core/models/fund.model';

@Component({
  selector: 'cfcs-fund-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './fund-form-dialog.component.html'
})
export class FundFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FundFormDialogComponent>);
  private data = inject<{ fund?: Fund }>(MAT_DIALOG_DATA, { optional: true });
  private store = inject(FundStore);

  fundForm!: FormGroup;
  isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = !!this.data?.fund;

    this.fundForm = this.fb.group({
      name: [this.data?.fund?.name || '', Validators.required],
      description: [this.data?.fund?.description || '', Validators.required],
      active: [this.data?.fund?.active ?? true],
      taxDeductible: [this.data?.fund?.taxDeductible ?? true],
    });
  }

  onSubmit() {
    if (this.fundForm.valid) {
      if (this.isEditMode && this.data?.fund) {
        this.store.updateFund(this.data.fund.id, this.fundForm.value);
      } else {
        this.store.addFund(this.fundForm.value);
      }
      this.dialogRef.close(true);
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
