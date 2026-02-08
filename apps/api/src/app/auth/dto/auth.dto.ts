// Data transfer object for user authentication.
export class LoginDto {
  email: string;
  password: string;
}

// Data transfer object for new user account creation.
export class RegisterDto {
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  // Restricts user roles to specific permission levels.
  role: 'OWNER' | 'ADMIN' | 'VIEWER';
  // Numeric identifier for the multi-tenant organization.
  organizationId!: number;
}

console.log('Auth DTOs ready for request validation');