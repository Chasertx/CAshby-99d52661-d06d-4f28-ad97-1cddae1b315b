import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Basic entry point for health checks and general status.
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Responds to the base API route to confirm the server is alive.
  @Get()
  getData() {
    console.log('Heartbeat: Root endpoint accessed.');
    return this.appService.getData();
  }
}