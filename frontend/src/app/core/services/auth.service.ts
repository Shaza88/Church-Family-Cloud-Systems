import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { AuthResponse, LoginRequest, User } from '../models/user.model';
import { MOCK_PERMISSIONS, MOCK_ROLES } from '../data/mock-auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor() {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock authentication logic
    // In a real app, this would hit the API
    return new Observable((observer) => {
      console.log('Login attempt with:', credentials);
      const username = credentials.username?.trim().toLowerCase();
      const password = credentials.password;

      setTimeout(() => {
        if (username === 'admin' && password === 'admin') {
          const user = this.createMockUser('u1', 'admin', ['r1']); // Admin Role
          const permissions = this.resolvePermissions(user.roles);
          const response: AuthResponse = {
            user,
            token: 'mock-jwt-token-admin',
            permissions,
          };
          this.saveSession(response);
          observer.next(response);
          observer.complete();
        } else if (username === 'user' && password === 'user') {
          const user = this.createMockUser('u2', 'user', ['r2']); // Secretary Role
          const permissions = this.resolvePermissions(user.roles);
          const response: AuthResponse = {
            user,
            token: 'mock-jwt-token-user',
            permissions,
          };
          this.saveSession(response);
          observer.next(response);
          observer.complete();
        } else if (username === 'viewer' && password === 'viewer') {
          const user = this.createMockUser('u3', 'viewer', ['r3']); // Viewer Role
          const permissions = this.resolvePermissions(user.roles);
          const response: AuthResponse = {
            user,
            token: 'mock-jwt-token-viewer',
            permissions,
          };
          this.saveSession(response);
          observer.next(response);
          observer.complete();
        } else {
          observer.error({ message: 'Invalid username or password' });
        }
      }, 1000); // Simulate network delay
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    // In a real app, you might also tell the backend to revoke the token
  }

  // Check if a session exists in local storage
  checkSession(): Observable<AuthResponse | null> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);

    if (token && userStr) {
      const user = JSON.parse(userStr);
      const permissions = this.resolvePermissions(user.roles);
      return of({ user, token, permissions });
    }
    return of(null);
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
  }

  private createMockUser(id: string, username: string, roles: string[]): User {
    return {
      id,
      username,
      email: `${username}@example.com`,
      roles,
      avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=random`,
    };
  }

  private resolvePermissions(roleIds: string[]): string[] {
    const permissions = new Set<string>();

    roleIds.forEach((roleId) => {
      const role = MOCK_ROLES.find((r) => r.id === roleId);
      if (role) {
        role.permissionIds.forEach((pId) => {
          const perm = MOCK_PERMISSIONS.find((p) => p.id === pId);
          if (perm) {
            permissions.add(perm.name);
          }
        });
      }
    });

    return Array.from(permissions);
  }
}
