import { AuditableEntity } from './base.model';

export type PaymentMethod = 'Cash' | 'Check' | 'Online';

export interface Donation extends AuditableEntity {
  id: string;
  batchId: string;
  householdId: string;
  fundId: string;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
}
