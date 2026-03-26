import { AuditableEntity } from './base.model';

export interface Group extends AuditableEntity {
  id: string;
  name: string;
  description: string;
  meetingTime: string;
}
