import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  effect,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { Subscription, delay, of, finalize } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { GroupStore } from '../../../core/store/group.store';
import { HouseholdService } from '../../../core/services/household.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BroadcastLogStore } from '../../../core/store/broadcast-log.store';
import { Household, Individual } from '../../../core/models/household.model';
import {
  RecipientPreviewDialogComponent,
  RecipientPreviewData,
} from './recipient-preview-dialog.component';

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
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
    MatChipsModule,
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
  broadcastLogStore = inject(BroadcastLogStore);
  dialog = inject(MatDialog);

  form: FormGroup;
  audienceTypes = ['All Active Households', 'Specific Ministry Groups'];
  isSending = false;

  /** Columns displayed in the History tab table */
  historyColumns: string[] = ['dateSent', 'subject', 'targetAudience', 'recipientCount'];

  private sub: Subscription = new Subscription();

  /** All households cached locally for fast filtering (avoids repeated service calls) */
  allHouseholds = signal<Household[]>([]);
  formTrigger = signal(0);

  /** Flat list of matched Individual records based on current form state */
  matchedRecipients = computed<{ name: string; household: string }[]>(() => {
    this.formTrigger(); // reactivity tracker

    if (!this.form) return [];

    const { audienceType, selectedGroups } = this.form.value;
    const households = this.allHouseholds();

    if (audienceType === 'All Active Households') {
      return this._flattenMembers(households.filter((h) => h.status === 'Active'));
    }

    if (audienceType === 'Specific Ministry Groups') {
      if (!Array.isArray(selectedGroups) || selectedGroups.length === 0) return [];
      return this._flattenMembers(
        households,
        (m) =>
          Array.isArray(m.groupIds) && m.groupIds.some((g) => selectedGroups.includes(g))
      );
    }

    return [];
  });

  /** Derived count for template binding */
  recipientCount = computed(() => this.matchedRecipients().length);

  /** Human-readable audience label for logging and the preview dialog */
  audienceLabel = computed<string>(() => {
    this.formTrigger();
    if (!this.form) return '';
    const { audienceType, selectedGroups } = this.form.value;
    if (audienceType === 'All Active Households') return 'All Active Households';
    if (audienceType === 'Specific Ministry Groups' && Array.isArray(selectedGroups) && selectedGroups.length > 0) {
      const names = selectedGroups
        .map((id: string) => this.groupStore.allGroups().find((g) => g.id === id)?.name)
        .filter(Boolean)
        .join(', ');
      return names || 'Specific Ministry Groups';
    }
    return audienceType;
  });

  constructor() {
    this.form = this.fb.group({
      audienceType: ['All Active Households', Validators.required],
      selectedGroups: [[]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });

    // Re-inject groupId from URL query param once groups have loaded
    effect(() => {
      const groups = this.groupStore.allGroups();
      const groupId = this.route.snapshot.queryParamMap.get('groupId');
      if (groups.length > 0 && groupId) {
        const currentSelection = this.form.value.selectedGroups;
        if (!currentSelection || currentSelection.length === 0) {
          setTimeout(() => {
            this.form.patchValue({
              audienceType: 'Specific Ministry Groups',
              selectedGroups: [groupId],
            });
          }, 50);
        }
      }
    });

    // Drive signal re-computation whenever the reactive form mutates
    this.sub.add(
      this.form.valueChanges.subscribe(() => {
        this.formTrigger.set(this.formTrigger() + 1);
      })
    );
  }

  ngOnInit(): void {
    this.groupStore.loadAllGroups();
    this.broadcastLogStore.loadLogs();

    this.householdService.getAllHouseholds().subscribe((households) => {
      this.allHouseholds.set(households);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  /** Opens the Recipient Preview dialog */
  openRecipientPreview(): void {
    const data: RecipientPreviewData = {
      audienceLabel: this.audienceLabel(),
      recipients: this.matchedRecipients(),
    };
    this.dialog.open(RecipientPreviewDialogComponent, {
      data,
      width: '480px',
      maxHeight: '80vh',
      panelClass: 'cfcs-dialog',
    });
  }

  sendBroadcast(): void {
    if (this.form.invalid || this.recipientCount() === 0) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSending = true;
    const snapshot = {
      subject: this.form.value.subject as string,
      body: this.form.value.message as string,
      recipientCount: this.recipientCount(),
      targetAudience: this.audienceLabel(),
    };

    of(true)
      .pipe(
        delay(2000),
        finalize(() => (this.isSending = false))
      )
      .subscribe(() => {
        // --- Behavior Patch: persist audit record ---
        this.broadcastLogStore.addLog(snapshot);

        this.notificationService.success(
          `Broadcast successfully sent to ${snapshot.recipientCount} recipients!`
        );
        this.form.reset({
          audienceType: 'All Active Households',
          selectedGroups: [],
        });
        window.history.replaceState({}, '', '/communications');
      });
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private _flattenMembers(
    households: Household[],
    memberFilter?: (m: Individual) => boolean
  ): { name: string; household: string }[] {
    const result: { name: string; household: string }[] = [];
    households.forEach((h) => {
      (h.members ?? []).forEach((m) => {
        if (!memberFilter || memberFilter(m)) {
          result.push({
            name: `${m.firstName}${m.lastName ? ' ' + m.lastName : ''}`,
            household: h.name,
          });
        }
      });
    });
    return result;
  }
}
