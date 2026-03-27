import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GroupStore } from '../../../core/store/group.store';
import { HouseholdService } from '../../../core/services/household.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Individual, Household } from '../../../core/models/household.model';
import { GroupAddMemberDialogComponent } from './group-add-member-dialog.component';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    PageHeaderComponent,
  ],
  templateUrl: './group-detail.component.html',
})
export class GroupDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  groupStore = inject(GroupStore);
  householdService = inject(HouseholdService);
  dialog = inject(MatDialog);
  notificationService = inject(NotificationService);

  groupId: string | null = null;
  displayedColumns: string[] = ['name', 'role', 'email', 'phone', 'actions'];
  dataSource = new MatTableDataSource<Individual & { householdId: string }>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id');
    if (this.groupId) {
      this.groupStore.loadGroupById(this.groupId);
      this.loadMembers();
    }
  }

  loadMembers() {
    this.householdService.getAllHouseholds().subscribe((households: Household[]) => {
      const groupMembers: (Individual & { householdId: string })[] = [];
      households.forEach((h) => {
        h.members.forEach((m) => {
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

  addMembers() {
    const dialogRef = this.dialog.open(GroupAddMemberDialogComponent, {
      width: '500px',
      data: { groupId: this.groupId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadMembers();
      }
    });
  }

  removeMember(member: Individual & { householdId: string }) {
    if (confirm(`Are you sure you want to remove ${member.firstName} from this group?`)) {
      this.householdService.getAllHouseholds().subscribe((households) => {
        const household = households.find((h) => h.id === member.householdId);
        if (household) {
          const targetMember = household.members.find((m) => m.id === member.id);
          if (targetMember && targetMember.groupIds) {
            targetMember.groupIds = targetMember.groupIds.filter((g) => g !== this.groupId);
            this.householdService.updateHousehold(household).subscribe(() => {
              this.notificationService.success('Member removed from group');
              this.loadMembers();
            });
          }
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
