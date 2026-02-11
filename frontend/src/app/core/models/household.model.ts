export type MemberRole = 'Head' | 'Spouse' | 'Child' | 'Other';
export type HouseholdStatus = 'Active' | 'Visitor' | 'Inactive';

export interface Individual {
  id: string;
  firstName: string;
  middleName?: string;
  lastName?: string; // Optional for minors (inherits household name)
  role: MemberRole;
  gender: 'Male' | 'Female';
  dateOfBirth?: Date;
  email?: string;
  phone?: string;
  profession?: string;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface Household {
  id: string;
  name: string;
  address: Address;
  status: HouseholdStatus;
  memberCount: number;
  members: Individual[];
}
