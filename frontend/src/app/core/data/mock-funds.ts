import { Fund } from '../models/fund.model';

export const MOCK_FUNDS: Fund[] = [
  {
    id: 'f1',
    name: 'General Fund',
    description: 'Primary fund for day-to-day operations and ministries.',
    active: true,
    taxDeductible: true,
    createdBy: 'system',
    createdAt: new Date('2023-01-01T08:00:00Z').toISOString(),
  },
  {
    id: 'f2',
    name: 'Building Fund',
    description: 'Dedicated to property maintenance, renovations, and new construction.',
    active: true,
    taxDeductible: true,
    createdBy: 'system',
    createdAt: new Date('2023-01-01T08:00:00Z').toISOString(),
  },
  {
    id: 'f3',
    name: 'Youth Ministry',
    description: 'Supports youth group activities, retreats, and events.',
    active: true,
    taxDeductible: true,
    createdBy: 'system',
    createdAt: new Date('2023-01-01T08:00:00Z').toISOString(),
  },
  {
    id: 'f4',
    name: 'Missions',
    description: 'Support for local and global missionary work.',
    active: true,
    taxDeductible: true,
    createdBy: 'system',
    createdAt: new Date('2023-01-01T08:00:00Z').toISOString(),
  }
];
