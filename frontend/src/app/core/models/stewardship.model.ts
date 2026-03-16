import { AuditableEntity } from './base.model';

export type StewardshipFrequency = 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
export type StewardshipStatus = 'Active' | 'Completed' | 'Cancelled';

export interface Stewardship extends AuditableEntity {
  id: string;
  householdId: string;
  fiscalYear: string | number;
  amount: number;
  frequency: StewardshipFrequency;
  totalYearlyAmount: number;
  status: StewardshipStatus;
}
