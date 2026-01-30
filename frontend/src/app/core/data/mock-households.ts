import { Household } from '../models/household.model';

export const MOCK_HOUSEHOLDS: Household[] = [
    {
        id: 'h1',
        name: 'Atieyeh, Rami & Shaza',
        address: '123 Maple Lane, Chesterbrook, PA',
        status: 'Active',
        memberCount: 4,
        members: []
    },
    {
        id: 'h2',
        name: 'Smith, John',
        address: '450 West Ave, Wayne, PA',
        status: 'Visitor',
        memberCount: 1,
        members: []
    },
    {
        id: 'h3',
        name: 'Doe, Jane',
        address: '99 Old Road, Paoli, PA',
        status: 'Inactive',
        memberCount: 2,
        members: []
    }
];