import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { UserRole } from '@task-mgmt/shared-data';

// Validates user session and role permissions against route requirements
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  
  // Extracts permitted roles defined in the route configuration
  const requiredRoles = (route.data['roles'] as UserRole[]) || [];

  // Verifies active session and role-based access rights
  if (user && user.role && requiredRoles.includes(user.role.toLowerCase() as UserRole)) {
    return true;
  }

  // Redirects unauthorized users to prevent routing loops
  console.warn('Unauthorized access attempt blocked');
  return router.parseUrl('/login');
};