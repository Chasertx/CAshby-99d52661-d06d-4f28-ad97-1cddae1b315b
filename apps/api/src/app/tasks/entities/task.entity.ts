import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Task as ITask } from '@task-mgmt/shared-data';

// Database table for storing project tasks.
@Entity('tasks')
export class TaskEntity {
  // Unique ID for each task using UUID format.
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Title or headline of the task.
  @Column()
  title: string;

  // The user assigned to handle the task.
  @Column({ nullable: true })
  assignee: string;

  // Extra details or context for the task.
  @Column({ nullable: true })
  description: string;

  // Task state mapped to the Kanban board columns.
  @Column({ 
    type: 'varchar', 
    default: 'open' 
  })
  status: 'open' | 'in-progress' | 'review' | 'closed';

  // Links the task to a specific organization.
  @Column({ type: 'int' })
  organizationId: number;

  // The ID of the user who created the task.
  @Column({ nullable: true })
  creatorId: string;

  // Automatically generated timestamp for creation.
  @CreateDateColumn()
  createdAt: Date;
}

console.log('Task schema is live');