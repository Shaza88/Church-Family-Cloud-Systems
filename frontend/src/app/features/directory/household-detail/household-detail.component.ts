import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HouseholdStore } from '../../../core/store/household.store';
import { HouseholdGeneralComponent } from './household-general/household-general.component';
import { HouseholdMembersComponent } from './household-members/household-members.component';
import { HouseholdDocumentsComponent } from './household-documents/household-documents.component';
import { HouseholdPicturesComponent } from './household-pictures/household-pictures.component';
import { HouseholdRelationshipsComponent } from './household-relationships/household-relationships.component';
import { HouseholdStewardshipsComponent } from './household-stewardships/household-stewardships.component';
import { HouseholdDonationsComponent } from './household-donations/household-donations.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';

@Component({
  selector: 'app-household-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    HouseholdGeneralComponent,
    HouseholdMembersComponent,
    HouseholdMembersComponent,
    HouseholdDocumentsComponent,
    HouseholdPicturesComponent,
    HouseholdRelationshipsComponent,
    HouseholdStewardshipsComponent,
    HouseholdDonationsComponent,
    PageHeaderComponent,
    HasPermissionDirective,
  ],
  templateUrl: './household-detail.component.html',
})
export class HouseholdDetailComponent implements OnInit {
  store = inject(HouseholdStore);
  route = inject(ActivatedRoute);
  router = inject(Router);

  isEditMode = false;
  householdId: string | null = null;

  ngOnInit() {
    this.householdId = this.route.snapshot.paramMap.get('id');
    if (this.householdId) {
      this.isEditMode = true;
      this.store.loadHousehold(this.householdId);
    } else {
      this.isEditMode = false;
      this.store.setSelectedHousehold(null);
    }
  }

  goBack() {
    this.router.navigate(['/directory']);
  }
}
