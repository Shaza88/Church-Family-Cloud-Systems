import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Permission, Role } from '../models/user.model';
import { MOCK_PERMISSIONS, MOCK_ROLES } from '../data/mock-auth';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  private roles = [...MOCK_ROLES];
  private permissions = [...MOCK_PERMISSIONS];

  getRoles(): Observable<Role[]> {
    return of([...this.roles]).pipe(delay(500));
  }

  getPermissions(): Observable<Permission[]> {
    return of([...this.permissions]).pipe(delay(500));
  }
}
