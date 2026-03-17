import { Donation } from '../models/donation.model';

export const MOCK_DONATIONS: Donation[] = [
  {
    id: 'd1a2b3c4-1234-5678-9abc-def012345678',
    householdId: 'h2', // Smith, John
    fundId: 'f1', // General Fund
    date: new Date('2024-10-15T10:00:00Z').toISOString(),
    amount: 500.0,
    paymentMethod: 'Online',
    reference: 'TXN-987654',
    createdBy: 'system',
    createdAt: new Date('2024-10-15T10:00:00Z').toISOString(),
  },
  {
    id: 'd2b3c4d5-2345-6789-abcd-ef0123456789',
    householdId: 'h2', // Smith, John
    fundId: 'f2', // Building Fund
    date: new Date('2024-11-01T09:30:00Z').toISOString(),
    amount: 250.0,
    paymentMethod: 'Check',
    reference: '1024',
    createdBy: 'system',
    createdAt: new Date('2024-11-01T09:30:00Z').toISOString(),
  },
  {
    id: 'd3c4d5e6-3456-7890-bcde-f0123456789a',
    householdId: 'h4', // Johnson, Michael & Sarah
    fundId: 'f1', // General Fund
    date: new Date('2024-12-25T11:15:00Z').toISOString(),
    amount: 1000.0,
    paymentMethod: 'Check',
    reference: '2056',
    createdBy: 'system',
    createdAt: new Date('2024-12-25T11:15:00Z').toISOString(),
  },
  {
    id: 'd4d5e6f7-4567-8901-cdef-0123456789ab',
    householdId: 'h9', // Miller, Robert & Linda
    fundId: 'f3', // Youth Ministry
    date: new Date('2025-01-10T08:45:00Z').toISOString(),
    amount: 100.0,
    paymentMethod: 'Cash',
    createdBy: 'system',
    createdAt: new Date('2025-01-10T08:45:00Z').toISOString(),
  },
  {
    id: 'd5e6f7g8-5678-9012-def0-123456789abc',
    householdId: 'h2', // Smith, John
    fundId: 'f4', // Missions
    date: new Date('2025-02-05T14:20:00Z').toISOString(),
    amount: 150.0,
    paymentMethod: 'Online',
    reference: 'TXN-112233',
    createdBy: 'system',
    createdAt: new Date('2025-02-05T14:20:00Z').toISOString(),
  }
];
