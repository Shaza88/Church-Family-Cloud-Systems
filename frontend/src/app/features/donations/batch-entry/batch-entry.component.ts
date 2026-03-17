import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { DonationStore } from '../../../core/store/donation.store';
import { FundStore } from '../../../core/store/fund.store';
import { HouseholdStore } from '../../../core/store/household.store';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Household } from '../../../core/models/household.model';
import { MOCK_HOUSEHOLDS } from '../../../core/data/mock-households';

@Component({
  selector: 'app-batch-entry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    PageHeaderComponent,
  ],
  templateUrl: './batch-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchEntryComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  donationStore = inject(DonationStore);
  fundStore = inject(FundStore);
  householdStore = inject(HouseholdStore);

  paymentMethods = ['Cash', 'Check', 'Online'];
  households = signal<Household[]>([]); // We'll feed mock households directly for the autocomplete
  
  batchForm: FormGroup = this.fb.group({
    batchDate: [new Date(), [Validators.required]],
    expectedTotal: [0, [Validators.required, Validators.min(0.01)]],
    donations: this.fb.array([], [Validators.required]),
  });

  runningTotal = signal<number>(0);
  isBalanced = computed(() => {
    const expected = this.batchForm.get('expectedTotal')?.value || 0;
    return this.runningTotal() === expected && this.runningTotal() > 0;
  });

  filteredHouseholdsOptions: Observable<Household[]>[] = [];
  private formChangesSub!: Subscription;

  get donationsParam(): FormArray {
    return this.batchForm.get('donations') as FormArray;
  }

  ngOnInit() {
    this.households.set([...MOCK_HOUSEHOLDS]);
    
    // Ensure funds are loaded
    if (this.fundStore.allFunds().length === 0) {
      this.fundStore.loadFunds();
    }

    // Add initial empty row
    this.addDonationRow();

    // Track running total
    this.formChangesSub = this.donationsParam.valueChanges.subscribe((rows: any) => {
      let total = 0;
      if (Array.isArray(rows)) {
        rows.forEach((row: any) => {
          if (row && row.amount) {
            const amount = parseFloat(row.amount);
            if (!isNaN(amount)) {
              total += amount;
            }
          }
        });
      }
      this.runningTotal.set(total);
    });
  }

  ngOnDestroy() {
    if (this.formChangesSub) {
      this.formChangesSub.unsubscribe();
    }
  }

  createDonationRow(): FormGroup {
    const row = this.fb.group({
      householdSearch: ['', [Validators.required]],
      householdId: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      fundId: ['', [Validators.required]],
      paymentMethod: ['Check', [Validators.required]],
      reference: [''],
    });

    // Wire up the autocomplete
    const index = this.donationsParam.length;
    this.filteredHouseholdsOptions[index] = row.get('householdSearch')!.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterHouseholds(name as string) : this.households().slice();
      })
    );

    return row;
  }

  addDonationRow(index?: number) {
    if (index !== undefined) {
      this.donationsParam.insert(index + 1, this.createDonationRow());
    } else {
      this.donationsParam.push(this.createDonationRow());
    }
  }

  removeDonationRow(index: number) {
    this.donationsParam.removeAt(index);
    this.filteredHouseholdsOptions.splice(index, 1);
    
    // Always keep at least one row
    if (this.donationsParam.length === 0) {
      this.addDonationRow();
    }
  }

  displayHousehold(household: Household): string {
    return household && household.name ? household.name : '';
  }

  getReferencePlaceholder(index: number): string {
    const row = this.donationsParam.at(index);
    if (!row) return 'Reference';
    const method = row.get('paymentMethod')?.value;
    if (method === 'Check') return 'Check #';
    if (method === 'Online') return 'Txn ID';
    if (method === 'Cash') return 'Note (Optional)';
    return 'Reference';
  }

  onHouseholdSelected(event: any, index: number) {
    const household: Household = event.option.value;
    const row = this.donationsParam.at(index) as FormGroup;
    // Set both the display text and the hidden ID
    row.patchValue({
      householdSearch: household,
      householdId: household.id,
    });
  }

  private _filterHouseholds(name: string): Household[] {
    const filterValue = name.toLowerCase();
    return this.households().filter((h: any) => h.name.toLowerCase().includes(filterValue));
  }

  submitBatch() {
    if (this.batchForm.invalid || !this.isBalanced()) {
      return;
    }

    const batchDate = new DatePipe('en-US').transform(this.batchForm.value.batchDate, 'yyyy-MM-ddTHH:mm:ssZ') || new Date().toISOString();
    
    const formValues: any[] = this.donationsParam.value || [];
    const donationsToSave = formValues.map((row: any) => ({
      householdId: row.householdId,
      fundId: row.fundId,
      amount: parseFloat(row.amount),
      paymentMethod: row.paymentMethod,
      reference: row.reference,
      date: batchDate,
    }));

    this.donationStore.addDonationsBatch(donationsToSave);
    
    // Reset form for next batch
    this.batchForm.reset({
      batchDate: new Date(),
      expectedTotal: 0,
    });
    this.donationsParam.clear();
    this.filteredHouseholdsOptions = [];
    this.addDonationRow();
    this.runningTotal.set(0);
  }
}
