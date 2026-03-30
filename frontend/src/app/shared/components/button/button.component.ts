import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'cfcs-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <button
      (click)="onClick.emit($event)"
      [disabled]="disabled || loading"
      [type]="type"
      class="inline-flex items-center justify-center font-medium transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      [ngClass]="getVariantClasses()">
      
      @if (loading) {
        <mat-spinner diameter="18" class="mr-2"></mat-spinner>
      } @else if (icon) {
        <mat-icon class="mr-2 text-sm h-5 w-5">{{ icon }}</mat-icon>
      }
      
      <span><ng-content></ng-content>{{ label }}</span>
    </button>
  `
})
export class ButtonComponent {
  /** Text label specifically passed via attribute */
  @Input() label: string = '';
  
  /** Material icon identifier to prefix the text */
  @Input() icon?: string;
  
  /** Standard HTML button type mapping */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  
  /** Button hierarchy variants mapped to Digital Cathedral tokens */
  @Input() variant: 'primary' | 'secondary' | 'tertiary' = 'primary';
  
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;

  @Output() onClick = new EventEmitter<MouseEvent>();

  /**
   * Translates the variant Input into Tailwind CSS v4 atomic classes
   */
  getVariantClasses(): string {
    const basePadding = 'px-5 py-2.5 text-sm';
    
    switch (this.variant) {
      case 'primary':
        // Primary: Signature Gradient and glass background over dark
        return `${basePadding} text-white bg-gradient-to-r from-primary to-primary-container shadow-sm hover:opacity-90 active:scale-[0.98]`;
      
      case 'secondary':
        // Secondary: Highest Surface contrast without border
        return `${basePadding} text-on-surface bg-surface-container-high hover:bg-surface-container-highest active:scale-[0.98]`;
        
      case 'tertiary':
      default:
        // Tertiary: Ghost button rendering surface only on interaction
        return `${basePadding} text-on-surface-variant bg-transparent hover:bg-surface-container-low hover:text-on-surface`;
    }
  }
}
