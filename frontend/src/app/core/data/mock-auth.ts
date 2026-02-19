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
    ],
  },
  {
    id: 'r2',
    name: 'Secretary',
    description: 'Can manage households but not security settings',
    permissionIds: ['p1', 'p2', 'p3', 'p5', 'p6', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18'], // No delete (p4), no security (p7-p12)
  },
  {
    id: 'r3',
    name: 'Viewer',
    description: 'Read-only access',
    permissionIds: ['p1', 'p5', 'p13', 'p15', 'p17'],
  },
];
