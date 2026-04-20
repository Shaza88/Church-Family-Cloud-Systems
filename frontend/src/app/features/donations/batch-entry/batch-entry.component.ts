import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, Subscription, map, startWith, combineLatest } from 'rxjs';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { BatchStatus } from '../../../core/models/batch.model';
import { DonationStore } from '../../../core/store/donation.store';
import { FundStore } from '../../../core/store/fund.store';
import { HouseholdStore } from '../../../core/store/household.store';
import { BatchStore } from '../../../core/store/batch.store';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { AuditInfoComponent } from '../../../shared/components/audit-info/audit-info.component';
import { Household } from '../../../core/models/household.model';
import { HouseholdService } from '../../../core/services/household.service';

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
    RouterModule,
    PageHeaderComponent,
    AuditInfoComponent,
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
  private householdService = inject(HouseholdService);

  paymentMethods = ['Cash', 'Check', 'Online'];
  households = signal<Household[]>([]); 
  
  batchForm: FormGroup = this.fb.group({
    donations: this.fb.array([], [Validators.required]),
  });

  private cdr = inject(ChangeDetectorRef);

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
  isPosted = computed(() => {
    return this.batchStore.selectedBatch()?.status === BatchStatus.Posted;
  });
  
  isBalanced = computed(() => {
    return this.runningTotal() === this.expectedTotal() && this.runningTotal() > 0;
  });

  private donations$ = toObservable(this.donationStore.donations);
  private households$ = toObservable(this.households);

  filteredHouseholdsOptions: Observable<Household[]>[] = [];
  private formChangesSub!: Subscription;
  private isPopulated = false;

  get donationsParam(): FormArray {
    return this.batchForm.get('donations') as FormArray;
  }

  ngOnInit() {
    this.householdService.getAllHouseholds().subscribe(h => {
      this.households.set(h);
      this.populateFormIfReady();
    });
    
    // Ensure funds are loaded
    if (this.fundStore.allFunds().length === 0) {
      this.fundStore.loadFunds();
    }

    // Load specific batch from URL or reset for new
    this.route.paramMap.subscribe(params => {
      this.isPopulated = false;
      const id = params.get('id');
      if (id) {
        this.batchStore.loadBatchById(id);
        this.donationStore.loadDonationsForBatch(id);
      } else {
        this.batchStore.clearSelectedBatch();
        this.donationStore.clearDonations();
        
        // Wipe form completely and inject a single fresh row
        while (this.donationsParam.length > 0) {
          this.donationsParam.removeAt(0);
        }
        this.filteredHouseholdsOptions = [];
        this.addDonationRow();
        
        // Enforce enabled state for fresh entry
        this.batchForm.enable({ emitEvent: false });
        this.cdr.markForCheck();
      }
    });

    // Populate the form if existing donations are found
    this.donations$.subscribe(() => {
      this.populateFormIfReady();
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

  private populateFormIfReady() {
    const donations = this.donationStore.donations();
    const households = this.households();
    
    if (donations.length > 0 && households.length > 0 && !this.isPopulated) {
      this.isPopulated = true;
      
      donations.forEach((d, idx) => {
        let row: FormGroup;
        if (idx < this.donationsParam.length) {
          row = this.donationsParam.at(idx) as FormGroup;
        } else {
          row = this.createDonationRow();
          this.donationsParam.push(row, { emitEvent: false });
        }
        
        const h = households.find(x => x.id === d.householdId);
        
        row.patchValue({
           householdSearch: h || '',
           householdId: d.householdId,
           amount: d.amount,
           fundId: d.fundId,
           paymentMethod: d.paymentMethod,
           reference: d.reference || ''
        }, { emitEvent: false });
      });
      
      // Clean up excess rows if any
      while (this.donationsParam.length > donations.length) {
        this.donationsParam.removeAt(this.donationsParam.length - 1);
      }
      
      this.donationsParam.updateValueAndValidity();
      
      // Explicitly enforce disabled state for all created rows if posted
      if (this.isPosted()) {
        this.batchForm.disable({ emitEvent: false });
      }
      
      this.cdr.markForCheck();
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
    this.filteredHouseholdsOptions[index] = combineLatest([
      row.get('householdSearch')!.valueChanges.pipe(startWith(row.get('householdSearch')!.value || '')),
      this.households$
    ]).pipe(
      map(([value, householdsList]: [any, Household[]]) => {
        const name = typeof value === 'string' ? value : value?.name;
        if (!name) return householdsList.slice();
        const filterValue = name.toLowerCase();
        return householdsList.filter((h: any) => h.name.toLowerCase().includes(filterValue));
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
    
    this.cdr.markForCheck();
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
      status: BatchStatus.Posted,
      actualTotal: this.runningTotal(),
      donationCount: donationsToSave.length
    });
    
    // Return to the dashboard automatically
    setTimeout(() => {
      this.router.navigate(['/donations/batch-entry']);
    }, 1000);
  }

  deleteBatch() {
    if (confirm('Are you sure you want to permanently delete this Batch?')) {
      const id = this.batchId();
      if (id) {
        this.batchStore.deleteBatch(id);
        setTimeout(() => {
          this.router.navigate(['/donations/batch-entry']);
        }, 800);
      }
    }
  }
}
