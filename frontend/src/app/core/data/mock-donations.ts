import { Donation } from '../models/donation.model';
import { Batch, BatchStatus } from '../models/batch.model';

export const MOCK_BATCHES: Batch[] = [
  {
    id: 'b1a2b3c4-1234-5678-9abc-def012345678',
    date: new Date('2024-10-15T00:00:00Z').toISOString(),
    expectedTotal: 500.0,
    actualTotal: 500.0,
    donationCount: 1,
    status: BatchStatus.Posted,
    createdBy: 'system',
    createdAt: new Date('2024-10-15T10:00:00Z').toISOString(),
  },
  {
    id: 'b2b3c4d5-2345-6789-abcd-ef0123456789',
    date: new Date('2024-11-01T00:00:00Z').toISOString(),
    expectedTotal: 250.0,
    actualTotal: 250.0,
    donationCount: 1,
    status: BatchStatus.Posted,
    createdBy: 'system',
    createdAt: new Date('2024-11-01T09:30:00Z').toISOString(),
  },
  {
    id: 'b3c4d5e6-3456-7890-bcde-f0123456789a',
    date: new Date('2024-12-25T00:00:00Z').toISOString(),
    expectedTotal: 1000.0,
    actualTotal: 1000.0,
    donationCount: 1,
    status: BatchStatus.Posted,
    createdBy: 'system',
    createdAt: new Date('2024-12-25T11:15:00Z').toISOString(),
  },
  {
    id: 'b4d5e6f7-4567-8901-cdef-0123456789ab',
    date: new Date('2025-01-10T00:00:00Z').toISOString(),
    expectedTotal: 100.0,
    actualTotal: 100.0,
    donationCount: 1,
    status: BatchStatus.Posted,
    createdBy: 'system',
    createdAt: new Date('2025-01-10T08:45:00Z').toISOString(),
  },
  {
    id: 'b5e6f7g8-5678-9012-def0-123456789abc',
    date: new Date('2025-02-05T00:00:00Z').toISOString(),
    expectedTotal: 150.0,
    actualTotal: 150.0,
    donationCount: 1,
    status: BatchStatus.Posted,
    createdBy: 'system',
    createdAt: new Date('2025-02-05T14:20:00Z').toISOString(),
  }
];

export const MOCK_DONATIONS: Donation[] = [
  {
    id: 'd1a2b3c4-1234-5678-9abc-def012345678',
    batchId: 'b1a2b3c4-1234-5678-9abc-def012345678',
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
    batchId: 'b2b3c4d5-2345-6789-abcd-ef0123456789',
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
    batchId: 'b3c4d5e6-3456-7890-bcde-f0123456789a',
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
    batchId: 'b4d5e6f7-4567-8901-cdef-0123456789ab',
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
    batchId: 'b5e6f7g8-5678-9012-def0-123456789abc',
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
