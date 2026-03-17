import { Stewardship } from '../models/stewardship.model';

export const MOCK_STEWARDSHIPS: Stewardship[] = [
  {
    id: 'f8b1c1d0-1b2b-4e6c-a2f0-1e5b1f9c8d7e',
    householdId: 'h2', // Smith, John
    fiscalYear: '2025',
    amount: 1000,
    frequency: 'Monthly',
    totalYearlyAmount: 12000,
    status: 'Active',
    createdBy: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    householdId: 'h2', // Smith, John
    fiscalYear: '2024',
    amount: 50,
    frequency: 'Weekly',
    totalYearlyAmount: 2600,
    status: 'Completed',
    createdBy: 'system',
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    householdId: 'h4', // Johnson, Michael & Sarah
    fiscalYear: '2024',
    amount: 5000,
    frequency: 'Annual',
    totalYearlyAmount: 5000,
    status: 'Completed',
    createdBy: 'system',
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    householdId: 'h9', // Miller, Robert & Linda
    fiscalYear: '2025',
    amount: 200,
    frequency: 'Bi-weekly',
    totalYearlyAmount: 5200,
    status: 'Active',
    createdBy: 'system',
    createdAt: new Date().toISOString(),
  }
];
