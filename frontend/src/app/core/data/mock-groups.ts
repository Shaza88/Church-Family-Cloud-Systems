import { Group } from '../models/group.model';
import { PageResponse, QueryRequest } from '../models/query.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const MOCK_GROUPS: Group[] = [
  {
    id: 'group-1',
    name: 'Choir',
    description: 'Leads Sunday worship through vocal praise.',
    meetingTime: 'Wednesdays at 7:00 PM',
    createdBy: 'system',
    createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
  },
  {
    id: 'group-2',
    name: 'Sunday School',
    description: 'Children and youth biblical education and activities.',
    meetingTime: 'Sundays at 9:00 AM',
    createdBy: 'system',
    createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
  },
  {
    id: 'group-3',
    name: 'Finance Committee',
    description: 'Oversees the financial health and stewardship of the church.',
    meetingTime: 'First Tuesday of every month at 6:30 PM',
    createdBy: 'system',
    createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
  },
  {
    id: 'group-4',
    name: 'Hospitality',
    description: 'Greets visitors and manages Sunday morning coffee and donuts.',
    meetingTime: 'Sundays at 8:30 AM',
    createdBy: 'system',
    createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
  }
];

export function getGroups(query: QueryRequest): Observable<PageResponse<Group>> {
  let filtered = [...MOCK_GROUPS];

  if (query.search) {
    const searchStr = query.search.toLowerCase();
    filtered = filtered.filter(g =>
      g.name.toLowerCase().includes(searchStr) ||
      g.description.toLowerCase().includes(searchStr)
    );
  }

  if (query.sort && query.sort.active && query.sort.direction) {
    const { active, direction } = query.sort;
    filtered.sort((a, b) => {
      const valA = (a as any)[active];
      const valB = (b as any)[active];
      const comparison = valA < valB ? -1 : valA > valB ? 1 : 0;
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  const total = filtered.length;
  const start = query.pageIndex * query.pageSize;
  const end = start + query.pageSize;
  const items = filtered.slice(start, end);

  return of({
    items,
    total,
    pageIndex: query.pageIndex,
    pageSize: query.pageSize,
  }).pipe(delay(400));
}
