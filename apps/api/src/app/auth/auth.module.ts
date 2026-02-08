import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RolesGuard } from './guards/rbac.guard';

// Bundles authentication logic, database access, and security guards.
@Module({
  imports: [
    // Enables database operations for the User entity within this module.
    TypeOrmModule.forFeature([User]),
    // Configures JWT signing with a secret key and expiration period.
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService, 
    UserService, 
    RolesGuard
  ],
  controllers: [AuthController],
  // Makes security and user services available to other parts of the application.
  exports: [AuthService, RolesGuard, UserService]
})
export class AuthModule {}

console.log('Authentication module initialized');