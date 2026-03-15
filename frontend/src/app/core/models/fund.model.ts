import { AuditableEntity } from './base.model';

export interface Fund extends AuditableEntity {
  id: string;
  name: string;
  description: string;
  active: boolean;
  taxDeductible: boolean;
}
