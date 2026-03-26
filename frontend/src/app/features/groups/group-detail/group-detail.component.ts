import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GroupStore } from '../../../core/store/group.store';
import { HouseholdService } from '../../../core/services/household.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Individual, Household } from '../../../core/models/household.model';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    PageHeaderComponent
  ],
  templateUrl: './group-detail.component.html'
})
export class GroupDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  groupStore = inject(GroupStore);
  householdService = inject(HouseholdService);

  groupId: string | null = null;
  displayedColumns: string[] = ['name', 'role', 'email', 'phone'];
  dataSource = new MatTableDataSource<Individual & { householdId: string }>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id');
    if (this.groupId) {
      this.groupStore.loadGroupById(this.groupId);
      
      this.householdService.getAllHouseholds().subscribe((households: Household[]) => {
        const groupMembers: (Individual & { householdId: string })[] = [];
        households.forEach(h => {
          h.members.forEach(m => {
            if (m.groupIds && m.groupIds.includes(this.groupId!)) {
              groupMembers.push({ ...m, householdId: h.id });
            }
          });
        });
        this.dataSource.data = groupMembers;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      });
    }
  }

  messageGroup() {
    this.router.navigate(['/communications'], { queryParams: { groupId: this.groupId } });
  }

  goBack() {
    this.router.navigate(['/groups']);
  }
}
