import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service'; 
import { LoginDto, RegisterDto } from './dto/auth.dto';

// Service to manage authentication logic and security token generation.
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Securely registers a user by hashing their password before database insertion.
  async register(dto: RegisterDto) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    
    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    return this.generateToken(user);
  }

  // Verifies user email and password against stored records.
  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (user && (await bcrypt.compare(dto.password, user.password))) {
      return this.generateToken(user);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // Encodes user identity and organization context into a signed JWT.
  public async generateToken(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      userId: user.id,
      role: user.role,
      // Ensures the numeric organization ID is included for tenant isolation.
      organizationId: user.organizationId 
    };
    
    console.log('Issuing new security token');
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      }
    };
  }
}