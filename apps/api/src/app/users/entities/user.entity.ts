import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '@task-mgmt/shared-data';

// Main schema for users and their account settings.
@Entity('users')
export class User {
  // Primary identifier for the database records.
  @PrimaryGeneratedColumn()
  id: number;

  // The unique email address used for signing in.
  @Column({ unique: true })
  email: string;

  // Stored hash—hidden from default query results for safety.
  @Column({ select: false })
  password: string;

  // Defines what the user can see and do within the app.
  @Column({
    type: 'text',
    default: UserRole.VIEWER,
  })
  role: UserRole;

  // Connects the user to a specific organization for data isolation.
  @Column()
  organizationId: number;

  // Timestamps to track when the account was created or modified.
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

console.log('User model is loaded and ready.');