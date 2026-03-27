import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../core/services/notification.service';
import { HouseholdService } from '../../../core/services/household.service';
import { Individual, Household } from '../../../core/models/household.model';

@Component({
  selector: 'app-group-add-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title class="m-0 text-gray-800 font-semibold border-b border-gray-100 pb-4">
      Add Member to Group
    </h2>
    <mat-dialog-content class="pt-6">
      <form [formGroup]="form" class="flex flex-col gap-4 min-w-[400px]">
        <p class="text-sm text-gray-600 mb-2">Select a household member to add directly to this ministry group.</p>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Select Members</mat-label>
          <mat-select formControlName="memberIds" multiple>
            <mat-select-trigger>
              <span class="truncate block w-full">{{ getSelectedDisplayNames() }}</span>
            </mat-select-trigger>
            @for (item of availableMembers; track item.member.id) {
              <mat-option [value]="item.member.id">
                <div class="flex flex-col">
                  <span class="font-medium">{{ item.member.lastName || item.household.name }}, {{ item.member.firstName }}</span>
                  <span class="text-xs text-gray-500">{{ item.household.name }} - {{ item.member.role }}</span>
                </div>
              </mat-option>
            }
            @if (availableMembers.length === 0) {
              <mat-option disabled>All members are already in this group.</mat-option>
            }
          </mat-select>
          @if (form.get('memberIds')?.hasError('required')) {
            <mat-error>Please select at least one member</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="border-t border-gray-100 pt-4 mt-2">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid || isSaving" (click)="save()">
        {{ isSaving ? 'Adding...' : 'Add to Group' }}
      </button>
    </mat-dialog-actions>
  `
})
export class GroupAddMemberDialogComponent implements OnInit {
  fb = inject(FormBuilder);
  notificationService = inject(NotificationService);
  householdService = inject(HouseholdService);

  form: FormGroup;
  groupId: string;
  isSaving = false;
  
  availableMembers: { member: Individual; household: Household }[] = [];

  constructor(
    public dialogRef: MatDialogRef<GroupAddMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupId: string }
  ) {
    this.groupId = data.groupId;
    this.form = this.fb.group({
      memberIds: [[], Validators.required]
    });
  }

  getSelectedDisplayNames(): string {
    const selectedIds = this.form.value.memberIds as string[];
    if (!selectedIds || selectedIds.length === 0) return '';
    
    return selectedIds.map(id => {
      const item = this.availableMembers.find(i => i.member.id === id);
      return item ? `${item.member.firstName} ${item.member.lastName || item.household.name}` : '';
    }).filter(n => n).join(', ');
  }

  ngOnInit() {
    this.householdService.getAllHouseholds().subscribe(households => {
      households.forEach(h => {
        h.members.forEach(m => {
          // Exclude members already assigned to this group
          if (!m.groupIds || !m.groupIds.includes(this.groupId)) {
            this.availableMembers.push({ member: m, household: h });
          }
        });
      });
      // Sort alphabetically by last name then first name
      this.availableMembers.sort((a, b) => {
        const aName = (a.member.lastName || a.household.name) + a.member.firstName;
        const bName = (b.member.lastName || b.household.name) + b.member.firstName;
        return aName.localeCompare(bName);
      });
    });
  }

  save() {
    if (this.form.invalid) return;

    this.isSaving = true;
    const memberIds: string[] = this.form.value.memberIds;

    // Group selected members by their household IDs to batch-update the master stores locally
    const householdsToUpdate = new Map<string, Household>();

    memberIds.forEach(id => {
      const targetItem = this.availableMembers.find(item => item.member.id === id);
      if (targetItem) {
        // Build the deep JSON clone natively isolating the original reference pointer map memory hooks
        if (!householdsToUpdate.has(targetItem.household.id)) {
          householdsToUpdate.set(targetItem.household.id, JSON.parse(JSON.stringify(targetItem.household)));
        }

        const household = householdsToUpdate.get(targetItem.household.id)!;
        const memberIndex = household.members.findIndex(m => m.id === id);

        if (memberIndex !== -1) {
          household.members[memberIndex].groupIds = [
            ...(household.members[memberIndex].groupIds || []),
            this.groupId
          ];
        }
      }
    });

    // Deploy multiple requests utilizing forkJoin to ensure complete dispatch isolation
    const requests = Array.from(householdsToUpdate.values()).map(h => this.householdService.updateHousehold(h));

    if (requests.length > 0) {
      forkJoin(requests).subscribe(() => {
        this.notificationService.success(`${memberIds.length} member(s) added to group successfully`);
        this.dialogRef.close(true);
      });
    } else {
      this.isSaving = false;
      this.dialogRef.close(false);
    }
  }
}
