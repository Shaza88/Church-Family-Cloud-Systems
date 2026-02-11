import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LookupStore } from '../../../core/store/lookup.store';
import { LookupValue } from '../../../core/models/lookup.model';

@Component({
  selector: 'cfcs-lookup-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Manage Lookups</h1>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <mat-tab-group animationDuration="0ms">
          <!-- Professions Tab -->
          <mat-tab label="Professions">
            <ng-template matTabContent>
              <div class="p-6">
                <!-- Add New -->
                <div class="flex gap-4 mb-6">
                  <mat-form-field appearance="outline" class="flex-1">
                    <mat-label>Add New Profession</mat-label>
                    <input matInput [(ngModel)]="newProfession" (keyup.enter)="addProfession()" />
                  </mat-form-field>
                  <button
                    mat-flat-button
                    color="primary"
                    class="h-[56px]"
                    (click)="addProfession()"
                    [disabled]="!newProfession.trim()"
                  >
                    <mat-icon>add</mat-icon> Add
                  </button>
                </div>

                <!-- List -->
                <div class="flex flex-col gap-2">
                  <div
                    *ngFor="let item of lookupStore.professions()"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <ng-container *ngIf="editingId === item.id; else viewProfession">
                      <div class="flex items-center gap-2 flex-1">
                        <input
                          class="flex-1 p-2 border border-blue-500 rounded outline-none"
                          [(ngModel)]="editingValue"
                          (keyup.enter)="saveEdit(item.id)"
                        />
                        <button mat-icon-button color="primary" (click)="saveEdit(item.id)">
                          <mat-icon>check</mat-icon>
                        </button>
                        <button mat-icon-button (click)="cancelEdit()">
                          <mat-icon>close</mat-icon>
                        </button>
                      </div>
                    </ng-container>
                    <ng-template #viewProfession>
                      <span class="font-medium text-gray-700">{{ item.value }}</span>
                      <div
                        class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <button mat-icon-button color="primary" (click)="startEdit(item)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button
                          mat-icon-button
                          color="warn"
                          (click)="lookupStore.deleteLookup(item.id)"
                        >
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </ng-template>
                  </div>
                </div>
              </div>
            </ng-template>
          </mat-tab>

          <!-- Statuses Tab -->
          <mat-tab label="Household Statuses">
            <ng-template matTabContent>
              <div class="p-6">
                <div class="flex gap-4 mb-6">
                  <mat-form-field appearance="outline" class="flex-1">
                    <mat-label>Add New Status</mat-label>
                    <input matInput [(ngModel)]="newStatus" (keyup.enter)="addStatus()" />
                  </mat-form-field>
                  <button
                    mat-flat-button
                    color="primary"
                    class="h-[56px]"
                    (click)="addStatus()"
                    [disabled]="!newStatus.trim()"
                  >
                    <mat-icon>add</mat-icon> Add
                  </button>
                </div>

                <div class="flex flex-col gap-2">
                  <div
                    *ngFor="let item of lookupStore.statuses()"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <ng-container *ngIf="editingId === item.id; else viewStatus">
                      <div class="flex items-center gap-2 flex-1">
                        <input
                          class="flex-1 p-2 border border-blue-500 rounded outline-none"
                          [(ngModel)]="editingValue"
                          (keyup.enter)="saveEdit(item.id)"
                        />
                        <button mat-icon-button color="primary" (click)="saveEdit(item.id)">
                          <mat-icon>check</mat-icon>
                        </button>
                        <button mat-icon-button (click)="cancelEdit()">
                          <mat-icon>close</mat-icon>
                        </button>
                      </div>
                    </ng-container>
                    <ng-template #viewStatus>
                      <span class="font-medium text-gray-700">{{ item.value }}</span>
                      <div
                        class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <button mat-icon-button color="primary" (click)="startEdit(item)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button
                          mat-icon-button
                          color="warn"
                          (click)="lookupStore.deleteLookup(item.id)"
                        >
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </ng-template>
                  </div>
                </div>
              </div>
            </ng-template>
          </mat-tab>

          <!-- Genders Tab -->
          <mat-tab label="Genders">
            <ng-template matTabContent>
              <div class="p-6">
                <div class="flex gap-4 mb-6">
                  <mat-form-field appearance="outline" class="flex-1">
                    <mat-label>Add New Gender</mat-label>
                    <input matInput [(ngModel)]="newGender" (keyup.enter)="addGender()" />
                  </mat-form-field>
                  <button
                    mat-flat-button
                    color="primary"
                    class="h-[56px]"
                    (click)="addGender()"
                    [disabled]="!newGender.trim()"
                  >
                    <mat-icon>add</mat-icon> Add
                  </button>
                </div>

                <div class="flex flex-col gap-2">
                  <div
                    *ngFor="let item of lookupStore.genders()"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <ng-container *ngIf="editingId === item.id; else viewGender">
                      <div class="flex items-center gap-2 flex-1">
                        <input
                          class="flex-1 p-2 border border-blue-500 rounded outline-none"
                          [(ngModel)]="editingValue"
                          (keyup.enter)="saveEdit(item.id)"
                        />
                        <button mat-icon-button color="primary" (click)="saveEdit(item.id)">
                          <mat-icon>check</mat-icon>
                        </button>
                        <button mat-icon-button (click)="cancelEdit()">
                          <mat-icon>close</mat-icon>
                        </button>
                      </div>
                    </ng-container>
                    <ng-template #viewGender>
                      <span class="font-medium text-gray-700">{{ item.value }}</span>
                      <div
                        class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <button mat-icon-button color="primary" (click)="startEdit(item)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button
                          mat-icon-button
                          color="warn"
                          (click)="lookupStore.deleteLookup(item.id)"
                        >
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </ng-template>
                  </div>
                </div>
              </div>
            </ng-template>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
})
export class LookupManagementComponent {
  lookupStore = inject(LookupStore);

  newProfession = '';
  newStatus = '';
  newGender = '';

  editingId: string | null = null;
  editingValue = '';

  addProfession() {
    if (this.newProfession.trim()) {
      this.lookupStore.addLookup('Profession', this.newProfession);
      this.newProfession = '';
    }
  }

  addStatus() {
    if (this.newStatus.trim()) {
      this.lookupStore.addLookup('HouseholdStatus', this.newStatus);
      this.newStatus = '';
    }
  }

  addGender() {
    if (this.newGender.trim()) {
      this.lookupStore.addLookup('Gender', this.newGender);
      this.newGender = '';
    }
  }

  startEdit(item: LookupValue) {
    this.editingId = item.id;
    this.editingValue = item.value;
  }

  saveEdit(id: string) {
    if (this.editingValue.trim()) {
      this.lookupStore.updateLookup(id, this.editingValue);
      this.editingId = null;
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editingValue = '';
  }
}
