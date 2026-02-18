export interface Permission {
  id: string;
  name: string; // e.g. 'household.view'
  group: string; // e.g. 'Household'
  description: string;
}

export interface Role {
  id: string;
  name: string; // e.g. 'Admin', 'Viewer'
  description: string;
  permissionIds: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string; // Optional avatar
  roles: string[]; // Role IDs
}

export interface AuthResponse {
  user: User;
  token: string;
  permissions: string[]; // Flattened list of permission names for easier checking
}

export interface LoginRequest {
  username: string;
  password: string;
}
