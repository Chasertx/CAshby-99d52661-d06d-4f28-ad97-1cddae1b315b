import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Middleware to protect routes using JWT strategy.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  
  // Validates the authentication result and handles unauthorized attempts.
  override handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Please log in to access this resource');
    }

    console.log('User session verified');
    return user;
  }
}