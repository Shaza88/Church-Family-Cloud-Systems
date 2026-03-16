import { Component, Inject, inject, ChangeDetectionStrategy, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { Stewardship, StewardshipFrequency, StewardshipStatus } from '../../../../core/models/stewardship.model';
import { StewardshipStore } from '../../../../core/store/stewardship.store';

export interface StewardshipDialogData {
  householdId: string;
  stewardship?: Stewardship;
}

interface StewardshipForm {
  id: FormControl<string | null>;
  householdId: FormControl<string>;
  fiscalYear: FormControl<string | null>;
  amount: FormControl<number | null>;
  frequency: FormControl<StewardshipFrequency | null>;
  totalYearlyAmount: FormControl<number | null>;
  status: FormControl<StewardshipStatus | null>;
}

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StewardshipFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  public readonly stewardshipStore = inject(StewardshipStore);
  private readonly dialogRef = inject(MatDialogRef<StewardshipFormDialogComponent>);
  public readonly data = inject<StewardshipDialogData>(MAT_DIALOG_DATA);

  public readonly isEditMode = !!this.data.stewardship;
  public readonly frequencies: StewardshipFrequency[] = [
    'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual'
  ];

  public readonly form: FormGroup<StewardshipForm> = this.fb.group<StewardshipForm>({
    id: new FormControl(this.data.stewardship?.id ?? null),
    householdId: new FormControl(this.data.householdId, { nonNullable: true, validators: Validators.required }),
    fiscalYear: new FormControl(
      { value: this.data.stewardship?.fiscalYear ? String(this.data.stewardship.fiscalYear) : '', disabled: this.isEditMode },
      Validators.required
    ),
    amount: new FormControl(this.data.stewardship?.amount ?? null, [Validators.required, Validators.min(0.01)]),
    frequency: new FormControl(this.data.stewardship?.frequency ?? null, Validators.required),
    totalYearlyAmount: new FormControl({ value: this.data.stewardship?.totalYearlyAmount ?? 0, disabled: true }),
    status: new FormControl(this.data.stewardship?.status ?? 'Active', Validators.required),
  });

  // Derived state directly from the centralized store computation
  public readonly availableFiscalYears: Signal<string[]> = computed(() => {
    if (this.isEditMode && this.data.stewardship) {
      return [String(this.data.stewardship.fiscalYear)];
    }
    return this.stewardshipStore.availableFiscalYears();
  });

  constructor() {
    this.initializeFiscalYear();
    this.setupTotalAmountCalculation();
  }

  private initializeFiscalYear(): void {
    if (!this.isEditMode) {
      const years = this.availableFiscalYears();
      if (years.length > 0 && !this.form.controls.fiscalYear.value) {
        this.form.patchValue({ fiscalYear: years[1] || years[0] });
      }
    }
  }

  private setupTotalAmountCalculation(): void {
    this.form.valueChanges.pipe(
      takeUntilDestroyed(), // Prevents memory leaks automatically bound to component lifecycle
      debounceTime(100),
      distinctUntilChanged((a, b) => a.amount === b.amount && a.frequency === b.frequency)
    ).subscribe((value) => {
      this.updateTotalYearlyAmount(value.amount, value.frequency);
    });
  }

  private updateTotalYearlyAmount(
    amount: number | null | undefined, 
    frequency: StewardshipFrequency | null | undefined
  ): void {
    const amt = Number(amount) || 0;
    let multiplier = 0;

    switch (frequency) {
      case 'Weekly': multiplier = 52; break;
      case 'Bi-weekly': multiplier = 26; break;
      case 'Monthly': multiplier = 12; break;
      case 'Quarterly': multiplier = 4; break;
      case 'Semi-Annual': multiplier = 2; break;
      case 'Annual': multiplier = 1; break;
    }

    const total = amt * multiplier;
    this.form.controls.totalYearlyAmount.setValue(total, { emitEvent: false });
  }

  public save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const payload: Omit<Stewardship, 'id' | 'createdAt' | 'createdBy'> = {
      householdId: formValue.householdId,
      fiscalYear: Number(formValue.fiscalYear),
      amount: Number(formValue.amount),
      frequency: formValue.frequency as StewardshipFrequency,
      totalYearlyAmount: Number(formValue.totalYearlyAmount),
      status: formValue.status as StewardshipStatus,
    };

    if (this.isEditMode && formValue.id) {
      this.stewardshipStore.updateStewardship({ id: formValue.id, updates: payload });
    } else {
      this.stewardshipStore.addStewardship(payload);
    }
    
    this.dialogRef.close(true);
  }
}
