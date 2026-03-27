import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Subscription, delay, of, finalize } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { GroupStore } from '../../../core/store/group.store';
import { HouseholdService } from '../../../core/services/household.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Household } from '../../../core/models/household.model';

@Component({
  selector: 'app-broadcast-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
  ],
  templateUrl: './broadcast-form.component.html',
})
export class BroadcastFormComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  groupStore = inject(GroupStore);
  householdService = inject(HouseholdService);
  notificationService = inject(NotificationService);

  form: FormGroup;
  audienceTypes = ['All Active Households', 'Specific Ministry Groups'];

  recipientCount = 0;
  isCalculating = false;
  isSending = false;

  private sub: Subscription = new Subscription();
  private allHouseholds: Household[] = [];

  constructor() {
    this.form = this.fb.group({
      audienceType: ['All Active Households', Validators.required],
      selectedGroups: [[]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.groupStore.loadAllGroups();

    // Cache households locally for rapid array filtering
    this.householdService.getAllHouseholds().subscribe((households) => {
      this.allHouseholds = households;
      this.calculateRecipients();
    });

    // Listen to form changes to natively calculate mathematical audience sizes
    this.sub.add(
      this.form.valueChanges.subscribe(() => {
        this.calculateRecipients();
      }),
    );

    // Parse URL for groupId parameter injection
    const groupId = this.route.snapshot.queryParamMap.get('groupId');
    if (groupId) {
      this.form.patchValue({
        audienceType: 'Specific Ministry Groups',
        selectedGroups: [groupId],
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  calculateRecipients() {
    // Light debounce emulation purely for UI UX polish
    this.isCalculating = true;
    const { audienceType, selectedGroups } = this.form.value;

    setTimeout(() => {
      if (audienceType === 'All Active Households') {
        const active = this.allHouseholds.filter((h) => h.status === 'Active');
        let count = 0;
        active.forEach((h) => (count += h.members.length));
        this.recipientCount = count;
      } else if (audienceType === 'Specific Ministry Groups') {
        if (!selectedGroups || selectedGroups.length === 0) {
          this.recipientCount = 0;
        } else {
          let count = 0;
          this.allHouseholds.forEach((h) => {
            h.members.forEach((m) => {
              if (m.groupIds && m.groupIds.some((g: string) => selectedGroups.includes(g))) {
                count++;
              }
            });
          });
          this.recipientCount = count;
        }
      }
      this.isCalculating = false;
    }, 150);
  }

  sendBroadcast() {
    if (this.form.invalid || this.recipientCount === 0) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSending = true;

    // Simulate native network HTTP dispatch
    of(true)
      .pipe(
        delay(2000),
        finalize(() => (this.isSending = false)),
      )
      .subscribe(() => {
        this.notificationService.success(
          `Broadcast successfully sent to ${this.recipientCount} recipients!`,
        );
        this.form.reset({
          audienceType: 'All Active Households',
          selectedGroups: [],
        });
        // Clear URL parameter natively without reloading mapping
        window.history.replaceState({}, '', '/communications');
      });
  }
}
