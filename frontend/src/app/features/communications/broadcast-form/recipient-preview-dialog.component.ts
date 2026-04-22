import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

export interface RecipientPreviewData {
  audienceLabel: string;
  recipients: { name: string; household: string }[];
}

@Component({
  selector: 'cfcs-recipient-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <div class="flex flex-col max-h-[80vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 class="text-lg font-bold text-gray-800 m-0">Recipient Preview</h2>
          <p class="text-xs text-gray-500 mt-0.5 m-0">Audience: <strong>{{ data.audienceLabel }}</strong></p>
        </div>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Count Banner -->
      <div class="px-6 py-3 bg-blue-50 flex items-center gap-2 border-b border-blue-100">
        <mat-icon class="text-blue-600 text-[18px]">people</mat-icon>
        <span class="text-sm font-semibold text-blue-800">
          {{ data.recipients.length }} recipient{{ data.recipients.length !== 1 ? 's' : '' }} will receive this broadcast
        </span>
      </div>

      <!-- Scrollable List -->
      <div class="flex-1 overflow-y-auto px-6 py-4">
        @if (data.recipients.length === 0) {
          <div class="flex flex-col items-center justify-center py-12 text-center text-gray-400">
            <mat-icon class="text-4xl mb-3">person_off</mat-icon>
            <p class="text-sm">No recipients match the current filters.</p>
          </div>
        } @else {
          <ul class="divide-y divide-gray-100">
            @for (r of data.recipients; track r.name) {
              <li class="flex items-center gap-3 py-2.5">
                <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {{ r.name.charAt(0) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-800 m-0 truncate">{{ r.name }}</p>
                  <p class="text-xs text-gray-500 m-0 truncate">{{ r.household }}</p>
                </div>
              </li>
            }
          </ul>
        }
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
        <button mat-flat-button color="primary" (click)="close()">Done</button>
      </div>
    </div>
  `,
})
export class RecipientPreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RecipientPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecipientPreviewData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
