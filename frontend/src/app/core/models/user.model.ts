import { AuditableEntity } from './base.model';

export interface Permission {
  id: string;
  name: string; // e.g. 'household.view'
  group: string; // e.g. 'Household'
  description: string;
}

export interface Role extends AuditableEntity {
  id: string;
  name: string; // e.g. 'Admin', 'Viewer'
  description: string;
  permissionIds: string[];
}

export interface User extends AuditableEntity {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  avatarUrl?: string; // Optional avatar
  roles: string[]; // Role IDs
  passwordMock?: string; // Mock password storage
  inviteToken?: string; // Token for setting up password
}

export interface AuthResponse {
  user: User;
  token: string;
  permissions: string[]; // Flattened list of permission names for easier checking
}

export interface LoginRequest {
  email: string;
  password: string;
}
