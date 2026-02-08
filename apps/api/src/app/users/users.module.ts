import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

// Bridges user data management with the rest of the application.
@Module({
  imports: [
    // Registers the User entity for database interaction within this scope.
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    UserService
  ],
  exports: [
    // Shares the service so AuthModule can handle login lookups.
    UserService
  ],
})
export class UsersModule {
  constructor() {
    console.log('UsersModule is online.');
  }
}