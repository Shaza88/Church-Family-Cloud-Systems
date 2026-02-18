import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { NotificationService } from '../services/notification.service';

export const permissionGuard = (requiredPermission: string): CanActivateFn => {
  return (route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    // First check if authenticated
    if (!authStore.isAuthenticated()) {
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    // Check permission
    // Note: We need to access the signal value, but we can't directly call the computed property from the store
    // in the same way as a component template. We need to access the underlying state or computed.
    // The store exposes signals.

    // We can check the permissions array directly since the store exposes it.
    const hasPermission = authStore.hasPermission(requiredPermission);

    if (hasPermission) {
      return true;
    }

    // Access denied
    notificationService.error('Access Denied: You do not have permission to view this page.');
    return router.createUrlTree(['/directory']); // Redirect to home/directory
  };
};
