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

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock authentication logic
    // In a real app, this would hit the API
    return new Observable((observer) => {
      console.log('Login attempt with:', credentials);
      const email = credentials.email?.trim().toLowerCase();
      const password = credentials.password;

      setTimeout(() => {
        // Find user by email
        const user = this.mockUsers.find((u) => u.email.toLowerCase() === email);

        if (user) {
          // Check if user has a set password (mock)
          if (user.passwordMock) {
            if (user.passwordMock === password) {
              this.handleLoginSuccess(observer, user);
              return;
            } else {
              observer.error({ message: 'Invalid email or password' });
              return;
            }
          }

          // Fallback to legacy hardcoded passwords for initial mock users
          // Using email prefix as password for data compatibility
          const emailPrefix = user.email.split('@')[0];
          if (
            (emailPrefix === 'admin' && password === 'admin') ||
            (emailPrefix === 'user' && password === 'user') ||
            (emailPrefix === 'viewer' && password === 'viewer')
          ) {
            this.handleLoginSuccess(observer, user);
            return;
          }
        }

        observer.error({ message: 'Invalid email or password' });
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

  private createMockUser(id: string, emailPrefix: string, roles: string[]): User {
    return {
      id,
      email: `${emailPrefix}@example.com`,
      firstName: emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1),
      lastName: 'User',
      roles,
      avatarUrl: `https://ui-avatars.com/api/?name=${emailPrefix}&background=random`,
      createdBy: 'system',
      createdAt: new Date('2023-01-01T08:00:00Z').toISOString(),
      lastModifiedBy: 'system',
      lastModifiedAt: new Date('2023-01-01T08:00:00Z').toISOString(),
    };
  }

  private handleLoginSuccess(observer: any, user: User) {
    const permissions = this.resolvePermissions(user.roles);
    const response: AuthResponse = {
      user,
      token: `mock-jwt-token-${user.id}`,
      permissions,
    };
    this.saveSession(response);
    observer.next(response);
    observer.complete();
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
  // Mock Users State
  private mockUsers: User[] = [];

  constructor() {
    this.loadMockUsers();
  }

  private loadMockUsers() {
    const stored = localStorage.getItem('mock_users');
    if (stored) {
      this.mockUsers = JSON.parse(stored);
      console.log(
        '[AuthService] Loaded mock users from LS:',
        this.mockUsers.length,
        this.mockUsers,
      );
    } else {
      // Initial seeds
      this.mockUsers = [
        this.createMockUser('u1', 'admin', ['r1']),
        this.createMockUser('u2', 'user', ['r2']),
        this.createMockUser('u3', 'viewer', ['r3']),
      ];
      this.saveMockUsers();
      console.log('[AuthService] Seeded mock users');
    }
  }

  private saveMockUsers() {
    localStorage.setItem('mock_users', JSON.stringify(this.mockUsers));
  }

  getUsers(): Observable<User[]> {
    return of(this.mockUsers).pipe(delay(500));
  }

  saveUser(user: User): Observable<User> {
    return new Observable((observer) => {
      setTimeout(() => {
        const currentUserStr = localStorage.getItem(this.USER_KEY);
        const currentUserEmail = currentUserStr ? JSON.parse(currentUserStr).email : 'system';
        const now = new Date().toISOString();

        const index = this.mockUsers.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          // Update
          const existingUser = this.mockUsers[index];
          this.mockUsers[index] = {
            ...user,
            createdBy: existingUser.createdBy || currentUserEmail,
            createdAt: existingUser.createdAt || now,
            lastModifiedBy: currentUserEmail,
            lastModifiedAt: now,
          };
          observer.next(this.mockUsers[index]);
        } else {
          // Create
          const newUser = {
            ...user,
            id: crypto.randomUUID(),
            createdBy: currentUserEmail,
            createdAt: now,
            lastModifiedBy: currentUserEmail,
            lastModifiedAt: now,
          };
          this.mockUsers.push(newUser);
          this.saveMockUsers();
          observer.next(newUser);
        }
        this.saveMockUsers(); // Save updates
        observer.complete();
      }, 500);
    });
  }

  deleteUser(id: string): Observable<void> {
    return new Observable((observer) => {
      setTimeout(() => {
        this.mockUsers = this.mockUsers.filter((u) => u.id !== id);
        this.saveMockUsers();
        observer.next();
        observer.complete();
      }, 500);
    });
  }

  // --- Password Management ---

  inviteUser(user: User): Observable<string> {
    return new Observable((observer) => {
      setTimeout(() => {
        const token = this.generateToken();
        const index = this.mockUsers.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          this.mockUsers[index].inviteToken = token;
          this.saveMockUsers();
          console.log(
            `[Mock Email] Invite Link: http://localhost:4200/auth/setup-password?token=${token}`,
          );
          console.log('[AuthService] Saved user with token:', this.mockUsers[index]);
          observer.next(token);
        } else {
          observer.error('User not found');
        }
        observer.complete();
      }, 500);
    });
  }

  setupPassword(token: string, password: string): Observable<void> {
    return new Observable((observer) => {
      setTimeout(() => {
        console.log('[AuthService] Attempting to setup password with token:', token);
        console.log('[AuthService] Current mock users:', this.mockUsers);
        const userIndex = this.mockUsers.findIndex((u) => u.inviteToken === token);
        if (userIndex !== -1) {
          this.mockUsers[userIndex].passwordMock = password;
          this.mockUsers[userIndex].inviteToken = undefined; // Clear token
          this.saveMockUsers();
          console.log('[AuthService] Password set for user:', this.mockUsers[userIndex].email);
          observer.next();
        } else {
          console.error(
            '[AuthService] Invalid or expired token. Available tokens:',
            this.mockUsers.map((u) => u.inviteToken),
          );
          observer.error('Invalid or expired token');
        }
        observer.complete();
      }, 500);
    });
  }

  forgotPassword(email: string): Observable<void> {
    return new Observable((observer) => {
      setTimeout(() => {
        const userIndex = this.mockUsers.findIndex((u) => u.email === email);
        if (userIndex !== -1) {
          const token = this.generateToken();
          this.mockUsers[userIndex].inviteToken = token; // Reuse inviteToken for reset
          this.saveMockUsers();
          console.log(
            `[Mock Email] Reset Link: http://localhost:4200/auth/reset-password?token=${token}`,
          );
          observer.next();
        } else {
          // Internal security practice: Don't reveal if email exists, but for mock we can just succeed
          observer.next();
        }
        observer.complete();
      }, 500);
    });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.setupPassword(token, password); // Reuse setup logic
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return new Observable((observer) => {
      setTimeout(() => {
        const userStr = localStorage.getItem(this.USER_KEY);
        if (userStr) {
          const user = JSON.parse(userStr);
          const mockUserIndex = this.mockUsers.findIndex((u) => u.id === user.id);

          if (mockUserIndex !== -1) {
            const mockUser = this.mockUsers[mockUserIndex];
            // Verify old password (mock check)
            // In a real app the backend handles this.
            // For mock, we assume success if oldPassword is not empty.
            if (!oldPassword) {
              observer.error({ message: 'Current password is required' });
              return;
            }

            // Update password
            this.mockUsers[mockUserIndex].passwordMock = newPassword;
            this.saveMockUsers();
            observer.next();
            observer.complete();
          } else {
            observer.error({ message: 'User not found' });
            observer.complete();
          }
        } else {
          observer.error({ message: 'No active session' });
          observer.complete();
        }
      }, 500);
    });
  }

  private generateToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }
}
