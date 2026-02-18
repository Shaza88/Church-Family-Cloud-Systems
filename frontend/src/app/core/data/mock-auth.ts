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
  { id: 'p7', name: 'roles.view', group: 'Security', description: 'View roles' },
  {
    id: 'p8',
    name: 'roles.manage',
    group: 'Security',
    description: 'Manage roles and permissions',
  },
];

export const MOCK_ROLES: Role[] = [
  {
    id: 'r1',
    name: 'Admin',
    description: 'Full access to all features',
    permissionIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'],
  },
  {
    id: 'r2',
    name: 'Secretary',
    description: 'Can manage households but not security settings',
    permissionIds: ['p1', 'p2', 'p3', 'p5', 'p6'], // No delete, no security
  },
  {
    id: 'r3',
    name: 'Viewer',
    description: 'Read-only access',
    permissionIds: ['p1', 'p5'],
  },
];
