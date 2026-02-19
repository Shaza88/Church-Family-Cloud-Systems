import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../../../core/store/auth.store';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    RouterModule,
    HasPermissionDirective,
    PageHeaderComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  authStore = inject(AuthStore);
}
