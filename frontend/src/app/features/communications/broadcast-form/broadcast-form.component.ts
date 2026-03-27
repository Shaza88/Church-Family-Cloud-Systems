import { Component, inject, OnInit, OnDestroy, effect, signal, computed } from '@angular/core';
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
  isSending = false;

  private sub: Subscription = new Subscription();

  // Robust Angular 19 Signal Architecture for natively blocking ViewCheck lifecycle crashing (NG0100)
  allHouseholds = signal<Household[]>([]);
  formTrigger = signal(0);
  
  recipientCount = computed(() => {
    // Read the tracking signal to bind the ReactiveForm mutations natively
    this.formTrigger();
    
    // Explicit null checks during early constructor execution before form binds
    if (!this.form) return 0;
    
    const { audienceType, selectedGroups } = this.form.value;
    const households = this.allHouseholds();

    if (audienceType === 'All Active Households') {
      let count = 0;
      households.filter(h => h.status === 'Active').forEach(h => {
        count += (h.members ? h.members.length : 0);
      });
      return count;
    } 
    
    if (audienceType === 'Specific Ministry Groups') {
      if (!Array.isArray(selectedGroups) || selectedGroups.length === 0) return 0;
      let count = 0;
      households.forEach(h => {
        if (h.members) {
           h.members.forEach(m => {
              if (m.groupIds && Array.isArray(m.groupIds) && m.groupIds.some((g: string) => selectedGroups.includes(g))) {
                 count++;
              }
           });
        }
      });
      return count;
    }
    
    return 0;
  });

  constructor() {
    this.form = this.fb.group({
      audienceType: ['All Active Households', Validators.required],
      selectedGroups: [[]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });

    // Angular Material <mat-select> rigidly strips reactive form payloads if its underlying <mat-option> array hasn't been asynchronously rendered into the DOM yet. 
    // We bind an `effect()` to watch the exact moment the Mock Server finishes responding. Once the array physically resolves, we push the URL payload back onto the dropdown securely.
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
          }, 50); // Let the DOM render the <mat-options> natively before evaluating the control payload
        }
      }
    });

    this.sub.add(
      this.form.valueChanges.subscribe(() => {
        this.formTrigger.set(this.formTrigger() + 1);
      }),
    );
  }

  ngOnInit() {
    this.groupStore.loadAllGroups();

    // Cache households locally for rapid array filtering
    this.householdService.getAllHouseholds().subscribe((households) => {
      this.allHouseholds.set(households);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // Diagnostic Extraction Utility
  _debugStringify(): string {
    const selected = this.form.value.selectedGroups;
    if (!Array.isArray(selected)) return 'Selected invalid: ' + typeof selected;
    let localMatches = 0;
    let dbMatchMap = '';
    
    this.allHouseholds().forEach(h => {
      h.members?.forEach(m => {
         if (m.groupIds && m.groupIds.length > 0) {
            dbMatchMap += `[${m.id} has ${JSON.stringify(m.groupIds)}] `;
            if (m.groupIds.some(g => selected.includes(g))) {
               localMatches++;
            }
         }
      });
    });
    return `Evaluated Matches: ${localMatches} | Tagged Members in System: ${dbMatchMap || 'NONE'}`;
  }

  sendBroadcast() {
    if (this.form.invalid || this.recipientCount() === 0) {
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
          `Broadcast successfully sent to ${this.recipientCount()} recipients!`,
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
