export type MemberRole = 'Head' | 'Spouse' | 'Child' | 'Other';
export type HouseholdStatus = 'Active' | 'Visitor' | 'Inactive';

export interface Individual {
    id: string;
    firstName: string;
    lastName: string;
    role: MemberRole;
    email?: string;
    phone?: string;
}

export interface Household {
    id: string;
    name: string;
    address: string;
    status: HouseholdStatus;
    memberCount: number;
    members: Individual[];
}