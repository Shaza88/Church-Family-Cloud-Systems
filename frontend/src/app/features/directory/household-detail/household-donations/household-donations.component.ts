import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HouseholdStore } from '../../../../core/store/household.store';
import { DonationStore } from '../../../../core/store/donation.store';
import { FundStore } from '../../../../core/store/fund.store';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-household-donations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    EmptyStateComponent,
  ],
  templateUrl: './household-donations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseholdDonationsComponent implements OnInit {
  householdStore = inject(HouseholdStore);
  donationStore = inject(DonationStore);
  fundStore = inject(FundStore);

  displayedColumns: string[] = ['date', 'amount', 'fund', 'paymentMethod', 'reference'];

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
}
