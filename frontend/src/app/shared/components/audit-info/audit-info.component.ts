import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (entity?.createdAt) {
      <div class="text-xs text-gray-500 font-medium" 
           [ngClass]="layout === 'row' ? 'flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-4 ' + customClasses : 'flex flex-col gap-0.5 ' + customClasses">
        <div class="whitespace-nowrap">
          Created by {{ entity?.createdBy || 'system' }} on {{ entity?.createdAt | date:'MMM d, y, h:mm:ss a' }}
        </div>
        @if (entity?.lastModifiedAt) {
          @if (layout === 'row') {
            <div class="hidden xl:block text-gray-300">|</div>
          }
          <div class="whitespace-nowrap">
            Last modified by {{ entity?.lastModifiedBy || 'system' }} on {{ entity?.lastModifiedAt | date:'MMM d, y, h:mm:ss a' }}
          </div>
        }
      </div>
    }
  `
})
export class AuditInfoComponent {
  @Input() entity: any;
  @Input() layout: 'row' | 'column' = 'row';
  @Input() customClasses: string = '';
}
