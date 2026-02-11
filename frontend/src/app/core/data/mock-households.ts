import { Household } from '../models/household.model';
import { PageResponse, QueryRequest } from '../models/query.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const MOCK_HOUSEHOLDS: Household[] = [
  {
    id: 'h1',
    name: 'Atieyeh, Rami & Shaza',
    address: {
      street1: '123 Maple Lane',
      city: 'Chesterbrook',
      state: 'PA',
      zip: '19087',
    },
    status: 'Active',
    memberCount: 4,
    members: [
      {
        id: 'm1',
        firstName: 'Rami',
        lastName: 'Atieyeh',
        role: 'Head',
        gender: 'Male',
        email: 'rami@example.com',
      },
      {
        id: 'm2',
        firstName: 'Shaza',
        lastName: 'Atieyeh',
        role: 'Spouse',
        gender: 'Female',
        email: 'shaza@example.com',
      },
      {
        id: 'm3',
        firstName: 'Ella',
        lastName: 'Atieyeh',
        role: 'Child',
        gender: 'Female',
        dateOfBirth: new Date('2015-05-10'),
      },
      {
        id: 'm4',
        firstName: 'Liam',
        lastName: 'Atieyeh',
        role: 'Child',
        gender: 'Male',
        dateOfBirth: new Date('2018-08-22'),
      },
    ],
  },
  {
    id: 'h2',
    name: 'Smith, John',
    address: {
      street1: '450 West Ave',
      city: 'Wayne',
      state: 'PA',
      zip: '19087',
    },
    status: 'Visitor',
    memberCount: 1,
    members: [
      {
        id: 'm5',
        firstName: 'John',
        lastName: 'Smith',
        role: 'Head',
        gender: 'Male',
        email: 'john.smith@example.com',
      },
    ],
  },
  {
    id: 'h3',
    name: 'Doe, Jane',
    address: {
      street1: '99 Old Road',
      city: 'Paoli',
      state: 'PA',
      zip: '19301',
    },
    status: 'Inactive',
    memberCount: 1,
    members: [
      {
        id: 'm6',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'Head',
        gender: 'Female',
        email: 'jane.doe@example.com',
      },
    ],
  },
  {
    id: 'h4',
    name: 'Johnson, Michael & Sarah',
    address: {
      street1: '789 Pine St',
      city: 'Malvern',
      state: 'PA',
      zip: '19355',
    },
    status: 'Active',
    memberCount: 3,
    members: [
      {
        id: 'm7',
        firstName: 'Michael',
        lastName: 'Johnson',
        role: 'Head',
        gender: 'Male',
        email: 'mike.j@example.com',
      },
      {
        id: 'm8',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'Spouse',
        gender: 'Female',
        email: 'sarah.j@example.com',
      },
      {
        id: 'm9',
        firstName: 'Emily',
        lastName: 'Johnson',
        role: 'Child',
        gender: 'Female',
        dateOfBirth: new Date('2010-03-15'),
      },
    ],
  },
  {
    id: 'h5',
    name: 'Williams, David',
    address: {
      street1: '321 Oak Dr',
      city: 'Berwyn',
      state: 'PA',
      zip: '19312',
    },
    status: 'Active',
    memberCount: 1,
    members: [
      {
        id: 'm10',
        firstName: 'David',
        lastName: 'Williams',
        role: 'Head',
        gender: 'Male',
        email: 'david.w@example.com',
      },
    ],
  },
  {
    id: 'h6',
    name: 'Brown, Emily',
    address: {
      street1: '654 Cedar Ln',
      city: 'Devon',
      state: 'PA',
      zip: '19333',
    },
    status: 'Visitor',
    memberCount: 1,
    members: [
      {
        id: 'm11',
        firstName: 'Emily',
        lastName: 'Brown',
        role: 'Head',
        gender: 'Female',
        email: 'emily.b@example.com',
      },
    ],
  },
  {
    id: 'h7',
    name: 'Jones, Chris & Pat',
    address: {
      street1: '987 Birch Rd',
      city: 'King of Prussia',
      state: 'PA',
      zip: '19406',
    },
    status: 'Active',
    memberCount: 2,
    members: [
      {
        id: 'm12',
        firstName: 'Chris',
        lastName: 'Jones',
        role: 'Head',
        gender: 'Male',
        email: 'chris.j@example.com',
      },
      {
        id: 'm13',
        firstName: 'Pat',
        lastName: 'Jones',
        role: 'Spouse',
        gender: 'Female',
        email: 'pat.j@example.com',
      },
    ],
  },
  {
    id: 'h8',
    name: 'Garcia, Maria',
    address: {
      street1: '147 Elm St',
      city: 'Norristown',
      state: 'PA',
      zip: '19401',
    },
    status: 'Inactive',
    memberCount: 1,
    members: [
      {
        id: 'm14',
        firstName: 'Maria',
        lastName: 'Garcia',
        role: 'Head',
        gender: 'Female',
        email: 'maria.g@example.com',
      },
    ],
  },
  {
    id: 'h9',
    name: 'Miller, Robert & Linda',
    address: {
      street1: '258 Spruce Ave',
      city: 'Phoenixville',
      state: 'PA',
      zip: '19460',
    },
    status: 'Active',
    memberCount: 2,
    members: [
      {
        id: 'm15',
        firstName: 'Robert',
        lastName: 'Miller',
        role: 'Head',
        gender: 'Male',
        email: 'robert.m@example.com',
      },
      {
        id: 'm16',
        firstName: 'Linda',
        lastName: 'Miller',
        role: 'Spouse',
        gender: 'Female',
        email: 'linda.m@example.com',
      },
    ],
  },
  {
    id: 'h10',
    name: 'Davis, James',
    address: {
      street1: '369 Walnut Blvd',
      city: 'West Chester',
      state: 'PA',
      zip: '19380',
    },
    status: 'Visitor',
    memberCount: 1,
    members: [
      {
        id: 'm17',
        firstName: 'James',
        lastName: 'Davis',
        role: 'Head',
        gender: 'Male',
        email: 'james.d@example.com',
      },
    ],
  },
  {
    id: 'h11',
    name: 'Rodriguez, Jose & Elena',
    address: {
      street1: '741 Cherry Ct',
      city: 'Exton',
      state: 'PA',
      zip: '19341',
    },
    status: 'Active',
    memberCount: 4,
    members: [
      {
        id: 'm18',
        firstName: 'Jose',
        lastName: 'Rodriguez',
        role: 'Head',
        gender: 'Male',
        email: 'jose.r@example.com',
      },
      {
        id: 'm19',
        firstName: 'Elena',
        lastName: 'Rodriguez',
        role: 'Spouse',
        gender: 'Female',
        email: 'elena.r@example.com',
      },
      {
        id: 'm20',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        role: 'Child',
        gender: 'Male',
        dateOfBirth: new Date('2012-06-20'),
      },
      {
        id: 'm21',
        firstName: 'Sofia',
        lastName: 'Rodriguez',
        role: 'Child',
        gender: 'Female',
        dateOfBirth: new Date('2014-09-12'),
      },
    ],
  },
  {
    id: 'h12',
    name: 'Martinez, William',
    address: {
      street1: '852 Poplar Pl',
      city: 'Downingtown',
      state: 'PA',
      zip: '19335',
    },
    status: 'Active',
    memberCount: 1,
    members: [
      {
        id: 'm22',
        firstName: 'William',
        lastName: 'Martinez',
        role: 'Head',
        gender: 'Male',
        email: 'william.m@example.com',
      },
    ],
  },
  {
    id: 'h13',
    name: 'Hernandez, Jennifer',
    address: {
      street1: '963 Sycamore Way',
      city: 'Coatesville',
      state: 'PA',
      zip: '19320',
    },
    status: 'Inactive',
    memberCount: 1,
    members: [
      {
        id: 'm23',
        firstName: 'Jennifer',
        lastName: 'Hernandez',
        role: 'Head',
        gender: 'Female',
        email: 'jen.h@example.com',
      },
    ],
  },
  {
    id: 'h14',
    name: 'Lopez, Charles & Amanda',
    address: {
      street1: '159 Willow Dr',
      city: 'Media',
      state: 'PA',
      zip: '19063',
    },
    status: 'Active',
    memberCount: 3,
    members: [
      {
        id: 'm24',
        firstName: 'Charles',
        lastName: 'Lopez',
        role: 'Head',
        gender: 'Male',
        email: 'charles.l@example.com',
      },
      {
        id: 'm25',
        firstName: 'Amanda',
        lastName: 'Lopez',
        role: 'Spouse',
        gender: 'Female',
        email: 'amanda.l@example.com',
      },
      {
        id: 'm26',
        firstName: 'Mateo',
        lastName: 'Lopez',
        role: 'Child',
        gender: 'Male',
        dateOfBirth: new Date('2019-02-28'),
      },
    ],
  },
  {
    id: 'h15',
    name: 'Gonzalez, Thomas',
    address: {
      street1: '357 Magnolia Ln',
      city: 'Springfield',
      state: 'PA',
      zip: '19064',
    },
    status: 'Visitor',
    memberCount: 1,
    members: [
      {
        id: 'm27',
        firstName: 'Thomas',
        lastName: 'Gonzalez',
        role: 'Head',
        gender: 'Male',
        email: 'thomas.g@example.com',
      },
    ],
  },
  {
    id: 'h16',
    name: 'Wilson, Daniel & Michelle',
    address: {
      street1: '486 Dogwood Rd',
      city: 'Broomall',
      state: 'PA',
      zip: '19008',
    },
    status: 'Active',
    memberCount: 2,
    members: [
      {
        id: 'm28',
        firstName: 'Daniel',
        lastName: 'Wilson',
        role: 'Head',
        gender: 'Male',
        email: 'daniel.w@example.com',
      },
      {
        id: 'm29',
        firstName: 'Michelle',
        lastName: 'Wilson',
        role: 'Spouse',
        gender: 'Female',
        email: 'michelle.w@example.com',
      },
    ],
  },
  {
    id: 'h17',
    name: 'Anderson, Matthew',
    address: {
      street1: '519 Cypress Cir',
      city: 'Newtown Square',
      state: 'PA',
      zip: '19073',
    },
    status: 'Active',
    memberCount: 1,
    members: [
      {
        id: 'm30',
        firstName: 'Matthew',
        lastName: 'Anderson',
        role: 'Head',
        gender: 'Male',
        email: 'matt.a@example.com',
      },
    ],
  },
];

export function getHouseholds(query: QueryRequest): Observable<PageResponse<Household>> {
  let filteredHouseholds = MOCK_HOUSEHOLDS;

  // Filter
  if (query.search) {
    const searchStr = query.search.toLowerCase();
    filteredHouseholds = filteredHouseholds.filter((h) =>
      (
        h.name +
        h.status +
        JSON.stringify(h.address) +
        h.members.map((m) => m.firstName + ' ' + m.lastName).join(' ')
      )
        .toLowerCase()
        .includes(searchStr),
    );
  }

  // Sort
  if (query.sort && query.sort.active && query.sort.direction) {
    const { active, direction } = query.sort;
    filteredHouseholds = [...filteredHouseholds].sort((a, b) => {
      const valA = (a as any)[active];
      const valB = (b as any)[active];

      const comparison = valA < valB ? -1 : valA > valB ? 1 : 0;
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  const total = filteredHouseholds.length;
  const start = query.pageIndex * query.pageSize;
  const end = start + query.pageSize;
  const items = filteredHouseholds.slice(start, end);

  return of({
    items,
    total,
    pageIndex: query.pageIndex,
    pageSize: query.pageSize,
  }).pipe(delay(500));
}
