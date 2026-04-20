import { AuditableEntity } from './base.model';

export enum BatchStatus {
  Open = 'Open',
  Posted = 'Posted'
}

export interface Batch extends AuditableEntity {
  id: string;
  date: string;
  expectedTotal: number;
  actualTotal: number;
  donationCount: number;
  status: BatchStatus;
}
