import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuditInterceptor } from './shared/audit.interceptor';
import { AuthModule } from './auth/auth.module';

// The main hub that ties all features and the database together.
@Module({
  imports: [
    AuthModule,
    TasksModule,
    // Database setup—synchronize is on for easy dev work.
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {
  constructor() {
    console.log('App root is humming along nicely.');
  }
}