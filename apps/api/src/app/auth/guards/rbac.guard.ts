import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@task-mgmt/shared-data';
import { ROLES_KEY } from './rbac.constants'; 
import { UserService } from '../../users/users.service';

// Guard to verify user permissions against required route roles.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService
  ) {}

  // Evaluates if the current user has the necessary role to proceed.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Permits access if no specific roles are defined for the route.
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    
    // Denies access if the user identity is missing from the request context.
    if (!user || !user.userId) return false;

    // Validates the role against the database to ensure permissions are current.
    const dbUser = await this.userService.findById(user.userId);
    
    console.log('Verifying access permissions for user');
    return dbUser && requiredRoles.some((role) => dbUser.role === role);
  }
}