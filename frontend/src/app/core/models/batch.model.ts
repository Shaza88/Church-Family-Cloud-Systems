import { AuditableEntity } from './base.model';

export type BatchStatus = 'Open' | 'Posted';

export interface Batch extends AuditableEntity {
  id: string;
  date: string;
  expectedTotal: number;
  actualTotal: number;
  donationCount: number;
  status: BatchStatus;
}
