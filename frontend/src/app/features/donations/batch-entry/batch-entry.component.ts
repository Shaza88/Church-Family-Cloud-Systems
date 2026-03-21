import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy, effect } from '@angular/core';
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
import { Router, ActivatedRoute } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { DonationStore } from '../../../core/store/donation.store';
import { FundStore } from '../../../core/store/fund.store';
import { HouseholdStore } from '../../../core/store/household.store';
import { BatchStore } from '../../../core/store/batch.store';
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  donationStore = inject(DonationStore);
  fundStore = inject(FundStore);
  householdStore = inject(HouseholdStore);
  batchStore = inject(BatchStore);

  paymentMethods = ['Cash', 'Check', 'Online'];
  households = signal<Household[]>([]); 
  
  batchForm: FormGroup = this.fb.group({
    donations: this.fb.array([], [Validators.required]),
  });

  constructor() {
    effect(() => {
      // Reactive Form sync: strictly bind the disabled state to the active batch store
      if (this.isPosted()) {
        this.batchForm.disable({ emitEvent: false });
      } else {
        this.batchForm.enable({ emitEvent: false });
      }
    });
  }

  runningTotal = signal<number>(0);
  
  // Computed batch properties
  batchId = computed(() => this.batchStore.selectedBatch()?.id);
  expectedTotal = computed(() => this.batchStore.selectedBatch()?.expectedTotal || 0);
  isPosted = computed(() => this.batchStore.selectedBatch()?.status === 'Posted');
  
  isBalanced = computed(() => {
    return this.runningTotal() === this.expectedTotal() && this.runningTotal() > 0;
  });

  private donations$ = toObservable(this.donationStore.donations);

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

    // Load specific batch from URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.batchStore.loadBatchById(id);
        this.donationStore.loadDonationsForBatch(id);
      }
    });

    // Populate the form if existing donations are found
    this.donations$.subscribe(donations => {
      if (donations.length > 0) {
        this.donationsParam.clear({ emitEvent: false });
        donations.forEach(d => {
          const row = this.createDonationRow();
          const h = this.households().find(x => x.id === d.householdId);
          row.patchValue({
             householdSearch: h || '',
             householdId: d.householdId,
             amount: d.amount,
             fundId: d.fundId,
             paymentMethod: d.paymentMethod,
             reference: d.reference || ''
          }, { emitEvent: false });
          this.donationsParam.push(row, { emitEvent: false });
        });
        
        // Manually trigger the valueChanges pipeline to sum runningTotals for preloaded data
        this.donationsParam.updateValueAndValidity();
      }
    });

    // Add initial empty row if none exists
    if (this.donationsParam.length === 0) {
      this.addDonationRow();
    }

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
    if (this.batchForm.invalid || !this.isBalanced() || !this.batchId()) {
      return;
    }

    const currentBatch = this.batchStore.selectedBatch();
    const batchDate = currentBatch?.date || new Date().toISOString();
    
    const formValues: any[] = this.donationsParam.value || [];
    const donationsToSave = formValues.map((row: any) => ({
      batchId: this.batchId()!,
      householdId: row.householdId,
      fundId: row.fundId,
      amount: parseFloat(row.amount),
      paymentMethod: row.paymentMethod,
      reference: row.reference,
      date: batchDate,
    }));

    // Save individual donations
    this.donationStore.addDonationsBatch(donationsToSave);
    
    // Transition the overarching Batch to Posted
    this.batchStore.updateBatchStatus({
      id: this.batchId()!,
      status: 'Posted',
      actualTotal: this.runningTotal(),
      donationCount: donationsToSave.length
    });
    
    // Return to the dashboard automatically
    setTimeout(() => {
      this.router.navigate(['/donations/batch-entry']);
    }, 1000);
  }
}
