import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HouseholdStore } from '../../../core/store/household.store';

@Component({
  selector: 'cfcs-household-directory',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './household-directory.html',
  styleUrl: './household-directory.scss',
})
export class HouseholdDirectoryComponent implements OnInit {
  readonly store = inject(HouseholdStore);
  displayedColumns: string[] = ['name', 'status', 'members', 'actions'];

  ngOnInit() {
    this.store.loadHouseholds();
  }

  applyFilter(event: Event) {
    this.store.updateFilter((event.target as HTMLInputElement).value);
  }
}
