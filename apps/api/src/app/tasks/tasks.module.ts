import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { TaskEntity } from './entities/task.entity';
import { TasksController } from './task.controller';
import { TasksService } from './task.services';
import { JwtStrategy } from '../auth/strategies/jwt.strategy'; 
import { AuthModule } from '../auth/auth.module';

// Wiring up the task management features and security.
@Module({
  imports: [
    AuthModule,
    // Plugs in Passport for handling JWT-based security.
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // Configures the JWT engine for token generation and verification.
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),

    // Connects the Task entity to the TypeORM database context.
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    JwtStrategy
  ],
  // Makes the TasksService available for injection in other modules.
  exports: [TasksService],
})
export class TasksModule {
  constructor() {
    console.log('Tasks module is up and running.');
  }
}