import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { GroupStore } from '../../../core/store/group.store';
import { Group } from '../../../core/models/group.model';
import { GroupDialogComponent } from './group-dialog.component';
import { HouseholdService } from '../../../core/services/household.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatDividerModule,
    PageHeaderComponent
  ],
  templateUrl: './group-list.component.html'
})
export class GroupListComponent implements OnInit {
  groupStore = inject(GroupStore);
  dialog = inject(MatDialog);
  router = inject(Router);
  householdService = inject(HouseholdService);

  displayedColumns: string[] = ['name', 'description', 'meetingTime', 'memberCount', 'actions'];
  memberCounts: Record<string, number> = {};

  ngOnInit() {
    this.groupStore.loadGroups();

    // Compute dynamic member counts
    this.householdService.getAllHouseholds().subscribe(households => {
      const counts: Record<string, number> = {};
      households.forEach(h => {
        h.members.forEach(m => {
          if (m.groupIds) {
            m.groupIds.forEach(gId => {
              counts[gId] = (counts[gId] || 0) + 1;
            });
          }
        });
      });
      this.memberCounts = counts;
    });
  }

  openGroupDialog(group?: Group) {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '500px',
      data: { group }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (group) {
          this.groupStore.updateGroup({ ...group, ...result });
        } else {
          this.groupStore.addGroup(result);
        }
      }
    });
  }

  deleteGroup(group: Group) {
    if (confirm(`Are you sure you want to delete ${group.name}?`)) {
      this.groupStore.deleteGroup(group.id);
    }
  }

  viewGroup(group: Group) {
    this.router.navigate(['/groups', group.id]);
  }
}
