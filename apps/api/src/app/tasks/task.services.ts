import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../tasks/entities/task.entity';

// Service layer to handle database operations for tasks.
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,
  ) {}

  // Grabs all tasks linked to a specific company ID.
  async findAllByOrg(organizationId: number) {
    const tasks = await this.taskRepo.find({ where: { organizationId } });
    
    console.log(`Scanning database... found ${tasks.length} items.`);
    return tasks;
  }

  // Ensures every new task is pinned to an organization.
  create(taskData: Partial<TaskEntity>) {
    if (!taskData.organizationId) {
      throw new Error('Task must be associated with an organization');
    }
    
    const task = this.taskRepo.create(taskData);
    return this.taskRepo.save(task);
  }

  // Finds a specific task and applies updates if it belongs to the user's org.
  async update(id: string, organizationId: number, updates: Partial<TaskEntity>) {
    const task = await this.taskRepo.findOne({ where: { id, organizationId } });
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    Object.assign(task, updates);
    return this.taskRepo.save(task);
  }

  // Removes the record from the database after checking ownership.
  async remove(id: string, organizationId: number) {
    const result = await this.taskRepo.delete({ id, organizationId });
    
    if (result.affected === 0) {
      console.log('Delete attempt failed—task might not exist.');
      throw new NotFoundException(`Task not found or access denied`);
    }
    
    return { deleted: true };
  }
}