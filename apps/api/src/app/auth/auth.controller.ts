import { Controller, Post, Body, Get, UseGuards, Request, Patch, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../auth/dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from '../users/users.service';
import { UserRole } from '@task-mgmt/shared-data';

// Handles user authentication, registration, and profile management.
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  // Creates a new user account and organization link.
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Validates credentials and returns a JWT access token.
  @Post('login')
  login(@Body() dto: LoginDto) {
    console.log('Login attempt received');
    return this.authService.login(dto);
  }

  // Modifies user permissions and issues an updated token for the new role.
  @Patch('update-role')
  @UseGuards(JwtAuthGuard)
  async updateRole(@Body() data: { role: UserRole }, @Req() req) {
    const updatedUser = await this.userService.updateRole(req.user.userId, data.role);
    
    return {
      user: updatedUser,
      access_token: this.authService.generateToken(updatedUser)
    };
  }

  // Returns current user details and a fresh token to sync frontend state.
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.userService.findById(req.user.userId);
    console.log('Profile data retrieved');
    
    return {
      userId: user.id,
      role: user.role,
      access_token: this.authService.generateToken(user)
    };
  }
}