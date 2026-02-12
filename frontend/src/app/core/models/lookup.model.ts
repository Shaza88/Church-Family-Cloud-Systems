export type LookupType =
  | 'Gender'
  | 'HouseholdStatus'
  | 'Profession'
  | 'Relationship'
  | 'HouseholdRelationshipType';

export interface LookupValue {
  id: string;
  type: LookupType;
  value: string;
}
