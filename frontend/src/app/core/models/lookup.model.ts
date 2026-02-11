export type LookupType = 'Gender' | 'HouseholdStatus' | 'Profession';

export interface LookupValue {
  id: string;
  type: LookupType;
  value: string;
}
