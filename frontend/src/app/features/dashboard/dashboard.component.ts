import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HouseholdStore } from '../../core/store/household.store';
import { HouseholdService } from '../../core/services/household.service';
import { Household } from '../../core/models/household.model';
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
  householdService = inject(HouseholdService);
  donationService = inject(DonationService);
  authService = inject(AuthService);

  loadingUsers = signal(true);
  totalUsers = signal(0);

  loadingDonations = signal(true);
  ytdDonationsSum = signal(0);
  
  loadingHouseholds = signal(true);
  activeHouseholdsCount = signal(0);

  ngOnInit() {
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

    // 3. Load Global Active Households
    this.householdService.getAllHouseholds().subscribe((households: Household[]) => {
      this.activeHouseholdsCount.set(households.filter((h: Household) => h.status === 'Active').length);
      this.loadingHouseholds.set(false);
    });
  }
}
