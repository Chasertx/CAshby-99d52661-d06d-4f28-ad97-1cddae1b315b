import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

// The main entry point that kicks everything off.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Lets the frontend talk to the backend without security headaches.
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Tacks /api onto every route for better organization.
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  const port = process.env.PORT || 3000;
  
  console.log('Server engine is warming up...');
  await app.listen(port);
  
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

// Fire it up and catch any early explosions.
bootstrap().catch(err => {
  console.error('System failed to launch:', err);
});