import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, UseInterceptors, Patch } from '@nestjs/common';
import { TasksService } from './task.services';
import { RolesGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../../../../../libs/shared/auth/src/lib/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '@task-mgmt/shared-data'; 
import { AuditInterceptor } from '../shared/audit.interceptor';

// Entry point for all task-related operations, locked down by JWT and RBAC.
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Grabs the org and user IDs from the token to tag the new task correctly.
  @Post()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async create(@Body() createTaskDto: any, @Req() req) {
    const taskData = {
      ...createTaskDto,
      organizationId: req.user.organizationId,
      creatorId: req.user.userId || req.user.sub
    };
    console.log(taskData);
    return this.tasksService.create(taskData);
  }

  // Pulls all tasks belonging specifically to the user's organization.
  @Get()
  @Roles(UserRole.VIEWER, UserRole.ADMIN, UserRole.OWNER)
  async findAll(@Req() req) {
    // Pulls the org ID from the decoded JWT.
    const orgId = req.user.organizationId;
    
    console.log(`User ${req.user.email} is requesting tasks for Org ${orgId}`);
    return this.tasksService.findAllByOrg(orgId);
  }

  // Updates task details but verifies the org ID matches to prevent cross-tenant editing.
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async update(@Param('id') id: string, @Body() updateTaskDto: any, @Req() req) {
    return this.tasksService.update(id, req.user.organizationId, updateTaskDto);
  }

  // Final deletion—reserved for owners to keep things tidy.
  @Delete(':id')
  @Roles(UserRole.OWNER)
  async remove(@Param('id') id: string, @Req() req) {
    console.log(`Removing task ${id}... hope you meant it!`);
    return this.tasksService.remove(id, req.user.organizationId);
  }
}