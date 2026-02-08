import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../lib/services/auth.service';
import { UserRole } from '../../../data/src/lib/user-role.enum';

// Validates current user role against required permissions for the route
export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as UserRole[];
  const userRole = authService.currentRole;

  // Checks for role match using case-insensitive comparison
  const hasAccess = requiredRoles.some(
    (role) => role.toLowerCase() === userRole?.toLowerCase()
  );

  // Redirects to dashboard if access is denied to a specific feature
  if (!hasAccess) {
    console.warn(`Access denied for role: ${userRole}`);
    return router.parseUrl('/dashboard');
  }

  console.log('Access granted');
  return true;
};