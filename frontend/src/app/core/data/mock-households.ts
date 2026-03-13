import { Household } from '../models/household.model';
import { PageResponse, QueryRequest } from '../models/query.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const MOCK_HOUSEHOLDS: Household[] = [
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
    createdBy: 'system',
    createdAt: new Date('2023-02-10T09:15:00Z').toISOString(),
    lastModifiedBy: 'admin@example.com',
    lastModifiedAt: new Date('2024-01-15T14:30:00Z').toISOString(),
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
    createdBy: 'system',
    createdAt: new Date('2023-03-05T11:20:00Z').toISOString(),
    lastModifiedBy: 'system',
    lastModifiedAt: new Date('2023-03-05T11:20:00Z').toISOString(),
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
    createdBy: 'admin@example.com',
    createdAt: new Date('2023-11-20T16:45:00Z').toISOString(),
    lastModifiedBy: 'admin@example.com',
    lastModifiedAt: new Date('2024-02-01T09:10:00Z').toISOString(),
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
    createdBy: 'system',
    createdAt: new Date('2023-05-12T10:05:00Z').toISOString(),
    lastModifiedBy: 'system',
    lastModifiedAt: new Date('2023-05-12T10:05:00Z').toISOString(),
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
    createdBy: 'system',
    createdAt: new Date('2023-08-22T13:40:00Z').toISOString(),
    lastModifiedBy: 'admin@example.com',
    lastModifiedAt: new Date('2024-05-18T10:15:00Z').toISOString(),
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

// Generate additional mock data to reach ~160 records
const firstNames = [
  'James',
  'Mary',
  'Robert',
  'Patricia',
  'John',
  'Jennifer',
  'Michael',
  'Linda',
  'David',
  'Elizabeth',
  'William',
  'Barbara',
  'Richard',
  'Susan',
  'Joseph',
  'Jessica',
  'Thomas',
  'Sarah',
  'Charles',
  'Karen',
];
const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
];
const cities = [
  'Wayne',
  'Paoli',
  'Malvern',
  'Berwyn',
  'Devon',
  'Exton',
  'Media',
  'Chester',
  'King of Prussia',
  'Norristown',
];
const statuses = ['Active', 'Inactive', 'Visitor'];

for (let i = 18; i <= 160; i++) {
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const headName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const spouseName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const hasSpouse = Math.random() > 0.4;
  const status = statuses[Math.floor(Math.random() * statuses.length)] as any;

  const members = [
    {
      id: `m${i}_1`,
      firstName: headName,
      lastName: lastName,
      role: 'Head',
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      email: `${headName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `555-${Math.floor(1000 + Math.random() * 9000).toString()}`,
    },
  ];

  if (hasSpouse) {
    members.push({
      id: `m${i}_2`,
      firstName: spouseName,
      lastName: lastName,
      role: 'Spouse',
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      email: `${spouseName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `555-${Math.floor(1000 + Math.random() * 9000).toString()}`,
    });
  }

  MOCK_HOUSEHOLDS.push({
    id: `h${i}`,
    name: hasSpouse ? `${lastName}, ${headName} & ${spouseName}` : `${lastName}, ${headName}`,
    address: {
      street1: `${Math.floor(Math.random() * 999) + 1} Maple Stick Rd`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: 'PA',
      zip: `19${Math.floor(300 + Math.random() * 99)}`,
    },
    status: status,
    memberCount: members.length + (Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0),
    members: members as any[],
    createdBy: 'system',
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    lastModifiedBy: 'system',
    lastModifiedAt: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
  });
}

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

  // Advanced Filters
  if (query.filters) {
    const { status, firstName, lastName, profession, email, phone, city, zip } = query.filters;

    if (status) {
      filteredHouseholds = filteredHouseholds.filter((h) => h.status === status);
    }

    if (firstName) {
      const fn = firstName.toLowerCase();
      filteredHouseholds = filteredHouseholds.filter((h) =>
        h.members.some((m) => m.role === 'Head' && m.firstName?.toLowerCase().includes(fn)),
      );
    }

    if (lastName) {
      const ln = lastName.toLowerCase();
      filteredHouseholds = filteredHouseholds.filter(
        (h) =>
          h.members.some((m) => m.role === 'Head' && m.lastName?.toLowerCase().includes(ln)) ||
          h.name.toLowerCase().includes(ln),
      );
    }

    if (city) {
      filteredHouseholds = filteredHouseholds.filter((h) =>
        h.address.city.toLowerCase().includes(city.toLowerCase()),
      );
    }

    if (zip) {
      filteredHouseholds = filteredHouseholds.filter((h) => h.address.zip.includes(zip));
    }

    if (profession) {
      const p = profession.toLowerCase();
      filteredHouseholds = filteredHouseholds.filter((h) =>
        h.members.some((m) => m.profession?.toLowerCase().includes(p)),
      );
    }

    if (email) {
      const e = email.toLowerCase();
      filteredHouseholds = filteredHouseholds.filter((h) =>
        h.members.some((m) => m.email?.toLowerCase().includes(e)),
      );
    }

    if (phone) {
      const p = phone.toLowerCase();
      filteredHouseholds = filteredHouseholds.filter((h) =>
        h.members.some((m) => m.phone?.toLowerCase().includes(p)),
      );
    }
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
