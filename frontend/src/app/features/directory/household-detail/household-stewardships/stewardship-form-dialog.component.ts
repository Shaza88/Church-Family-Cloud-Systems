import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Stewardship, StewardshipFrequency } from '../../../../core/models/stewardship.model';
import { StewardshipStore } from '../../../../core/store/stewardship.store';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-stewardship-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './stewardship-form-dialog.component.html',
})
export class StewardshipFormDialogComponent implements OnInit {
  fb = inject(FormBuilder);
  stewardshipStore = inject(StewardshipStore);
  
  form: FormGroup;
  isEditMode = false;

  frequencies: StewardshipFrequency[] = [
    'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual'
  ];

  // Logic to determine available fiscal years for a new stewardship
  availableFiscalYears: string[] = [];
  
  constructor(
    public dialogRef: MatDialogRef<StewardshipFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { householdId: string; stewardship?: Stewardship },
  ) {
    this.isEditMode = !!data.stewardship;

    this.form = this.fb.group({
      id: [data.stewardship?.id || null],
      householdId: [data.householdId],
      fiscalYear: [
        { value: data.stewardship?.fiscalYear || '', disabled: this.isEditMode }, 
        Validators.required
      ],
      amount: [data.stewardship?.amount || '', [Validators.required, Validators.min(0.01)]],
      frequency: [data.stewardship?.frequency || '', Validators.required],
      totalYearlyAmount: [{ value: data.stewardship?.totalYearlyAmount || 0, disabled: true }],
      status: [data.stewardship?.status || 'Active', Validators.required],
    });
  }

  ngOnInit(): void {
    this.calculateAvailableFiscalYears();

    // Auto-calculate Total Yearly Amount
    this.form.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged((a, b) => a.amount === b.amount && a.frequency === b.frequency)
    ).subscribe(() => {
      this.updateTotalYearlyAmount();
    });
  }

  calculateAvailableFiscalYears() {
    const currentYear = new Date().getFullYear();
    const possibleYears = [
      String(currentYear - 1), 
      String(currentYear), 
      String(currentYear + 1), 
      String(currentYear + 2)
    ];

    if (this.isEditMode && this.data.stewardship) {
      // In edit mode, they can only keep the current one (it's disabled anyway)
      this.availableFiscalYears = [String(this.data.stewardship.fiscalYear)];
    } else {
      // For new records, filter out years that already exist for this household
      const existingYears = this.stewardshipStore.stewardships()
        .filter(s => s.householdId === this.data.householdId)
        .map(s => String(s.fiscalYear));
      
      this.availableFiscalYears = possibleYears.filter(year => !existingYears.includes(year));
      
      if (this.availableFiscalYears.length > 0 && !this.form.get('fiscalYear')?.value) {
        this.form.patchValue({ fiscalYear: this.availableFiscalYears[1] || this.availableFiscalYears[0] });
      }
    }
  }

  updateTotalYearlyAmount() {
    const amount = Number(this.form.get('amount')?.value) || 0;
    const frequency = this.form.get('frequency')?.value as StewardshipFrequency;
    let multiplier = 0;

    switch (frequency) {
      case 'Weekly': multiplier = 52; break;
      case 'Bi-weekly': multiplier = 26; break;
      case 'Monthly': multiplier = 12; break;
      case 'Quarterly': multiplier = 4; break;
      case 'Semi-Annual': multiplier = 2; break;
      case 'Annual': multiplier = 1; break;
    }

    const total = amount * multiplier;
    this.form.patchValue({ totalYearlyAmount: total }, { emitEvent: false });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue(); // gets disabled fields too
    const payload = {
      ...formValue,
      amount: Number(formValue.amount),
      totalYearlyAmount: Number(formValue.totalYearlyAmount)
    };

    if (this.isEditMode && payload.id) {
      this.stewardshipStore.updateStewardship(payload.id, payload);
    } else {
      this.stewardshipStore.addStewardship(payload);
    }
    
    this.dialogRef.close(true);
  }
}
