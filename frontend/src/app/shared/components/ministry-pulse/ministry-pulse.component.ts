import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'cfcs-ministry-pulse',
  standalone: true,
  imports: [CommonModule, MatIconModule, CardComponent],
  template: `
    <cfcs-card [level]="'lowest'" [ghostBorder]="true">
      <div class="flex flex-col gap-1 w-full relative">
        <!-- Optional Icon Floating Graphic -->
        @if (icon) {
          <mat-icon class="absolute top-0 right-[-10px] text-6xl opacity-5 text-tertiary select-none" style="width: 64px; height: 64px; font-size: 64px;">
            {{ icon }}
          </mat-icon>
        }
        
        <span class="text-on-surface-variant font-sans font-medium text-sm tracking-wide">
          {{ title }}
        </span>
        
        <div class="flex items-baseline gap-2 mt-2">
          <span class="font-display text-4xl font-extrabold text-on-surface tracking-tight">
            {{ value }}
          </span>
          
          @if (trend) {
            <span class="text-xs font-semibold flex items-center" 
                  [ngClass]="trend > 0 ? 'text-green-600' : (trend < 0 ? 'text-red-500' : 'text-gray-400')">
              <mat-icon class="!text-[16px] !leading-none !w-4 !h-4">{{ trend > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
              {{ trend | number:'1.0-1' }}%
            </span>
          }
        </div>
        
        <!-- Synthetic Chart Sparkline utilizing Tertiary color strictly from spec -->
        <div class="w-full h-1 mt-6 rounded-full bg-surface-container overflow-hidden">
          <div class="h-full bg-tertiary opacity-80 rounded-full" [style.width.%]="percentFilled"></div>
        </div>
      </div>
    </cfcs-card>
  `
})
export class MinistryPulseComponent {
  /** Label indicating what Metric is being tracked. */
  @Input() title: string = '';
  
  /** The core analytical value mapped to headline-sm (Manrope) */
  @Input() value: number | string = 0;
  
  /** Background decorative watermark icon */
  @Input() icon?: string;
  
  /** Optional metric plotting a historical comparison */
  @Input() trend?: number;
  
  /** Determines the length of the decorative sparkline bar */
  @Input() percentFilled: number = 75;
}
