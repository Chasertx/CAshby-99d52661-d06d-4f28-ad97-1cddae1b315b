import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// Strategy for validating JSON Web Tokens provided in the Authorization header.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'YOUR_SECRET_KEY',
    });
  }

  // Decodes the JWT payload and maps it to a user object for request context.
  async validate(payload: any) {
    const user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      // Maintains the numeric ID for multi-tenant data isolation.
      organizationId: payload.organizationId
    };

    console.log('JWT identity extracted');
    return user;
  }
}