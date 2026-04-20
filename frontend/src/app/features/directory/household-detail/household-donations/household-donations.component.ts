import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, ActivatedRoute } from '@angular/router';
import { HouseholdStore } from '../../../../core/store/household.store';
import { DonationStore } from '../../../../core/store/donation.store';
import { FundStore } from '../../../../core/store/fund.store';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { HasPermissionDirective } from '../../../../core/directives/has-permission.directive';
import { signal } from '@angular/core';

@Component({
  selector: 'app-household-donations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    EmptyStateComponent,
    HasPermissionDirective,
  ],
  templateUrl: './household-donations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseholdDonationsComponent implements OnInit {
  householdStore = inject(HouseholdStore);
  donationStore = inject(DonationStore);
  fundStore = inject(FundStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  displayedColumns: string[] = ['date', 'amount', 'fund', 'paymentMethod', 'reference'];

  // Tax Statement Selection
  availableYears = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];
  selectedYear = signal<number>(this.availableYears[1]); // Default to last year


  ngOnInit(): void {
    // Load funds so we can resolve the fund name if not already loaded
    if (this.fundStore.allFunds().length === 0) {
      this.fundStore.loadFunds();
    }

    const householdId = this.householdStore.selectedHousehold()?.id;
    if (householdId) {
      this.donationStore.loadDonationsForHousehold(householdId);
    }
  }

  getFundName(fundId: string): string {
    const fund = this.fundStore.allFunds().find(f => f.id === fundId);
    return fund ? fund.name : 'Unknown Fund';
  }

  generateTaxStatement() {
    const householdId = this.householdStore.selectedHousehold()?.id;
    if (householdId) {
      this.router.navigate(['../', householdId, 'tax-statement'], { 
        relativeTo: this.route,
        queryParams: { year: this.selectedYear() }
      });
    }
  }
}
