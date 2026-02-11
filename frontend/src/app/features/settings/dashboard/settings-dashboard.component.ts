import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cfcs-settings-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Lookups Management Card -->
        <a routerLink="/settings/lookups" class="block no-underline group h-full">
          <mat-card
            class="h-full hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 !rounded-xl"
          >
            <mat-card-content
              class="flex flex-col items-center justify-center p-8 text-center gap-4"
            >
              <div
                class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors"
              >
                <mat-icon class="text-blue-600 text-3xl w-8 h-8 !leading-8">list_alt</mat-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Manage Lookups</h3>
                <p class="text-gray-500 text-sm">
                  Customize drop-down values for Genders, Statuses, and Professions.
                </p>
              </div>
            </mat-card-content>
          </mat-card>
        </a>

        <!-- Placeholder for future settings -->
        <!--
        <div class="opacity-50 pointer-events-none">
           ... Card ...
        </div>
        -->
      </div>
    </div>
  `,
  styles: [],
})
export class SettingsDashboardComponent {}
