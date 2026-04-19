import { Permission, Role } from '../models/user.model';

export const MOCK_PERMISSIONS: Permission[] = [
  // Household Permissions
  { id: 'p1', name: 'household.view', group: 'Household', description: 'View households' },
  { id: 'p2', name: 'household.create', group: 'Household', description: 'Create new households' },
  { id: 'p3', name: 'household.edit', group: 'Household', description: 'Edit existing households' },
  { id: 'p4', name: 'household.delete', group: 'Household', description: 'Delete households' },

  // Settings/Lookup Permissions
  { id: 'p5', name: 'settings.view', group: 'Settings', description: 'View settings' },
  { id: 'p6', name: 'settings.edit', group: 'Settings', description: 'Edit settings' },

  // Admin/Security Permissions
  { id: 'p7', name: 'roles.view', group: 'Administration', description: 'View roles' },
  {
    id: 'p8',
    name: 'roles.manage',
    group: 'Administration',
    description: 'Manage roles and permissions',
  },
  { id: 'p9', name: 'users.view', group: 'Administration', description: 'View users' },
  { id: 'p10', name: 'users.create', group: 'Administration', description: 'Create users' },
  { id: 'p11', name: 'users.edit', group: 'Administration', description: 'Edit users' },
  { id: 'p12', name: 'users.delete', group: 'Administration', description: 'Delete users' },

  // Household Features
  { id: 'p13', name: 'relationships.view', group: 'Household', description: 'View relationships' },
  {
    id: 'p14',
    name: 'relationships.manage',
    group: 'Household',
    description: 'Manage relationships',
  },
  { id: 'p15', name: 'documents.view', group: 'Household', description: 'View documents' },
  { id: 'p16', name: 'documents.manage', group: 'Household', description: 'Manage documents' },
  { id: 'p17', name: 'pictures.view', group: 'Household', description: 'View pictures' },
  { id: 'p18', name: 'pictures.manage', group: 'Household', description: 'Manage pictures' },
  { id: 'p19', name: 'stewardships.view', group: 'Household', description: 'View stewardships' },
  { id: 'p20', name: 'stewardships.manage', group: 'Household', description: 'Manage stewardships' },

  // Finances Permissions
  { id: 'p21', name: 'donations.view', group: 'Finances', description: 'View individual donations' },
  { id: 'p22', name: 'donations.manage', group: 'Finances', description: 'Manage individual donations' },
  { id: 'p23', name: 'donations.batch', group: 'Finances', description: 'Access batch entry' },
  { id: 'p24', name: 'taxstatements.view', group: 'Finances', description: 'View tax statements' },
  { id: 'p25', name: 'taxstatements.generate', group: 'Finances', description: 'Generate tax statements' },

  // Groups & Ministries Permissions
  { id: 'p26', name: 'groups.view', group: 'Groups', description: 'View groups and ministries' },
  { id: 'p27', name: 'groups.manage', group: 'Groups', description: 'Manage groups and members' },

  // Communications Permissions
  { id: 'p28', name: 'communications.view', group: 'Communications', description: 'View communications' },
  { id: 'p29', name: 'communications.send', group: 'Communications', description: 'Send communications' },

  // Reports Permissions
  { id: 'p30', name: 'reports.view', group: 'Reports', description: 'View reports' },
];

export const MOCK_ROLES: Role[] = [
  {
    id: 'r1',
    name: 'Admin',
    description: 'Full access to all features',
    permissionIds: [
      'p1',
      'p2',
      'p3',
      'p4',
      'p5',
      'p6',
      'p7',
      'p8',
      'p9',
      'p10',
      'p11',
      'p12',
      'p13',
      'p14',
      'p15',
      'p16',
      'p17',
      'p18',
      'p19',
      'p20',
      'p21',
      'p22',
      'p23',
      'p24',
      'p25',
      'p26',
      'p27',
      'p28',
      'p29',
      'p30',
    ],
    createdBy: 'system',
    createdAt: new Date('2023-01-01T08:00:00Z').toISOString(),
    lastModifiedBy: 'system',
    lastModifiedAt: new Date('2023-01-01T08:00:00Z').toISOString(),
  },
  {
    id: 'r2',
    name: 'Secretary',
    description: 'Can manage households but not security settings',
    permissionIds: ['p1', 'p2', 'p3', 'p5', 'p6', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20', 'p21', 'p22', 'p23', 'p24', 'p25', 'p26', 'p27', 'p28', 'p29', 'p30'], // No delete (p4), no security (p7-p12)
    createdBy: 'system',
    createdAt: new Date('2023-01-15T10:30:00Z').toISOString(),
    lastModifiedBy: 'admin@example.com',
    lastModifiedAt: new Date('2023-06-20T14:15:00Z').toISOString(),
  },
  {
    id: 'r3',
    name: 'Viewer',
    description: 'Read-only access',
    permissionIds: ['p1', 'p5', 'p13', 'p15', 'p17', 'p19', 'p21', 'p24', 'p26', 'p28', 'p30'],
    createdBy: 'system',
    createdAt: new Date('2023-01-15T10:35:00Z').toISOString(),
    lastModifiedBy: 'system',
    lastModifiedAt: new Date('2023-01-15T10:35:00Z').toISOString(),
  },
];
