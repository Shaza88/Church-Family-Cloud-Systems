import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Group } from '../models/group.model';
import { getGroups, MOCK_GROUPS } from '../data/mock-groups';
import { QueryRequest, PageResponse } from '../models/query.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  getGroups(query: QueryRequest): Observable<PageResponse<Group>> {
    return getGroups(query);
  }

  getAllGroups(): Observable<Group[]> {
    return of(MOCK_GROUPS).pipe(delay(200));
  }

  getGroupById(id: string): Observable<Group | undefined> {
    const group = MOCK_GROUPS.find((g) => g.id === id);
    return of(group).pipe(delay(400));
  }

  addGroup(group: Group): Observable<Group> {
    group.id = `group-${MOCK_GROUPS.length + 1}`;
    MOCK_GROUPS.push(group);
    return of(group).pipe(delay(400));
  }

  updateGroup(group: Group): Observable<Group> {
    const index = MOCK_GROUPS.findIndex((g) => g.id === group.id);
    if (index !== -1) {
      MOCK_GROUPS[index] = group;
      return of(group).pipe(delay(400));
    }
    throw new Error(`Group with id ${group.id} not found`);
  }
  
  deleteGroup(id: string): Observable<void> {
    const index = MOCK_GROUPS.findIndex(g => g.id === id);
    if (index !== -1) {
      MOCK_GROUPS.splice(index, 1);
    }
    return of(void 0).pipe(delay(400));
  }
}
