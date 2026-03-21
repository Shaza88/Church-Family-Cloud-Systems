import { Component, OnInit, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { HouseholdStore } from '../../../../core/store/household.store';
import { DonationStore } from '../../../../core/store/donation.store';
import { FundStore } from '../../../../core/store/fund.store';

@Component({
  selector: 'app-tax-statement',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './tax-statement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxStatementComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  householdStore = inject(HouseholdStore);
  donationStore = inject(DonationStore);
  fundStore = inject(FundStore);

  today = new Date();

  fiscalYear = this.route.snapshot.queryParamMap.get('year') || new Date().getFullYear().toString();
  displayedColumns = ['date', 'amount', 'fund', 'paymentMethod', 'reference'];

  // Signal to get the current household
  household = this.householdStore.selectedHousehold;

  // Compute the tax-deductible donations for this specific year
  deductibleDonations = computed(() => {
    const yearStr = this.fiscalYear.toString();
    const allDonations: any[] = this.donationStore.sortedDonations();
    const allFunds: any[] = this.fundStore.allFunds();

    return allDonations.filter((donation: any) => {
      // 1. Must be in the correct fiscal year
      if (!donation.date.startsWith(yearStr)) return false;

      // 2. The fund must be marked as taxDeductible
      const fund = allFunds.find((f: any) => f.id === donation.fundId);
      return fund?.taxDeductible === true;
    });
  });

  // Calculate total deductible sum
  totalDeductible = computed(() => {
    return this.deductibleDonations().reduce((sum: number, current: any) => sum + current.amount, 0);
  });

  ngOnInit() {
    // Ensure funds are loaded so we can check the taxDeductible flag
    if (this.fundStore.allFunds().length === 0) {
      this.fundStore.loadFunds();
    }
  }

  getFundName(fundId: string): string {
    const funds: any[] = this.fundStore.allFunds();
    const fund = funds.find((f: any) => f.id === fundId);
    return fund ? fund.name : 'Unknown';
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  printStatement() {
    window.print();
  }
}
