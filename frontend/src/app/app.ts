import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { AuthStore } from './core/store/auth.store';
import { HasPermissionDirective } from './core/directives/has-permission.directive';

@Component({
  selector: 'cfcs-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    HasPermissionDirective,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  authStore = inject(AuthStore);
  title = 'church-family-cloud-systems';

  constructor() {}

  ngOnInit() {
    this.authStore.checkSession();
  }

  logout() {
    this.authStore.logout();
  }
}
