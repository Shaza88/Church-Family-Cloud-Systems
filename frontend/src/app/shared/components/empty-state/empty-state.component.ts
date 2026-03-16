import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-12 text-center"
         [ngClass]="{
           'bg-gray-50 border border-dashed border-gray-300 rounded-lg': bordered,
           'w-full': true
         }">
      <mat-icon class="text-gray-400 text-5xl w-12 h-12 mb-4 !leading-none !font-size-5xl" style="font-size: 48px;">{{ icon }}</mat-icon>
      <h3 class="text-lg font-medium text-gray-700">{{ title }}</h3>
      <p class="text-gray-500 max-w-sm mt-1 mb-6">{{ message }}</p>
      
      @if (actionText) {
        <button mat-stroked-button color="primary" (click)="actionClick.emit()">
          @if (actionIcon) {
            <mat-icon>{{ actionIcon }}</mat-icon>
          }
          {{ actionText }}
        </button>
      }
    </div>
  `,
  styles: []
})
export class EmptyStateComponent {
  @Input() icon: string = 'info';
  @Input() title: string = 'No records found';
  @Input() message: string = '';
  @Input() actionText?: string;
  @Input() actionIcon?: string;
  @Input() bordered: boolean = false;
  
  @Output() actionClick = new EventEmitter<void>();
}
