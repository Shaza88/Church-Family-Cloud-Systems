import { AuditableEntity } from './base.model';

export type MemberRole = 'Head' | 'Spouse' | 'Child' | 'Other';
export type HouseholdStatus = 'Active' | 'Visitor' | 'Inactive';

export interface Individual {
  id: string;
  firstName: string;
  middleName?: string;
  lastName?: string; // Optional for minors (inherits household name)
  role: MemberRole;
  gender: 'Male' | 'Female';
  dateOfBirth?: string; // ISO 8601 string
  email?: string;
  phone?: string;
  profession?: string;
  relationship?: string; // e.g. Father, Mother, etc.
  groupIds?: string[]; // IDs of assigned ministry groups
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface Household extends AuditableEntity {
  id: string;
  name: string;
  address: Address;
  status: HouseholdStatus;
  phone?: string;
  phone2?: string;
  memberCount: number;
  members: Individual[];
  documents?: { name: string; type: string; url: string; date: string }[];
  pictures?: { name: string; url: string; date: string }[];
  relatedHouseholds?: { householdId: string; relationshipType: string; notes?: string }[];
}

export interface CreateHouseholdDto {
  name: string;
  address: Address;
  status: HouseholdStatus;
  phone?: string;
  phone2?: string;
  members: Omit<Individual, 'id'>[];
}

export interface UpdateHouseholdDto {
  id: string;
  name?: string;
  address?: Address;
  status?: HouseholdStatus;
  phone?: string;
  phone2?: string;
  members?: Individual[];
}
