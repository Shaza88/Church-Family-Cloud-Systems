import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cfcs-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="rounded-2xl p-6 transition-all duration-300"
      [ngClass]="getSurfaceLayerClass()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  /**
   * Defines the Tonal Depth of the card mapping directly to the 
   * 'Digital Cathedral' color token specification. 
   * Defaults to 'lowest' (#ffffff).
   */
  @Input() level: 'highest' | 'low' | 'lowest' | 'base' = 'lowest';

  /**
   * Renders Ghost Borders specifically targeting data grid contrast per design spec.
   */
  @Input() ghostBorder: boolean = true;

  getSurfaceLayerClass(): string {
    const baseClasses = this.ghostBorder ? 'border border-outline-variant/15' : '';
    
    switch (this.level) {
      case 'highest':
        return `bg-surface-container-highest shadow-ambient ${baseClasses}`;
      case 'low':
        return `bg-surface-container-low ${baseClasses}`;
      case 'base':
        return `bg-surface`;
      case 'lowest':
      default:
        return `bg-surface-container-lowest shadow-ambient ${baseClasses}`;
    }
  }
}
