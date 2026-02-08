import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@task-mgmt/shared-data';
import { ROLES_KEY } from './rbac.constants';

// Attaches permission metadata to controller handlers for guard validation
export const Roles = (...roles: UserRole[]) => {
  console.log(`Setting metadata for roles: ${roles.join(', ')}`);
  return SetMetadata(ROLES_KEY, roles);
}