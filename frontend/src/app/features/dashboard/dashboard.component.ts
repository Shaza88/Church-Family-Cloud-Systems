import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HouseholdStore } from '../../core/store/household.store';
import { DonationService } from '../../core/services/donation.service';
import { AuthService } from '../../core/services/auth.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  householdStore = inject(HouseholdStore);
  donationService = inject(DonationService);
  authService = inject(AuthService);

  loadingUsers = signal(true);
  totalUsers = signal(0);

  loadingDonations = signal(true);
  ytdDonationsSum = signal(0);

  // Compute Active Households from global HouseholdStore
  activeHouseholdsCount = computed(() => {
    return this.householdStore.households()?.filter(h => h.status === 'Active').length || 0;
  });

  ngOnInit() {
    this.householdStore.loadHouseholds();

    // 1. Load System Users
    this.authService.getUsers().subscribe(users => {
      this.totalUsers.set(users.length);
      this.loadingUsers.set(false);
    });

    // 2. Load Global YTD Donations
    this.donationService.getAllDonations().subscribe(donations => {
      const currentYear = new Date().getFullYear();
      const sum = donations
        .filter(d => new Date(d.date).getFullYear() === currentYear)
        .reduce((acc, d) => acc + d.amount, 0);
      
      this.ytdDonationsSum.set(sum);
      this.loadingDonations.set(false);
    });
  }
}
