import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '@task-mgmt/shared-data';

// Database schema for user accounts and permission management.
@Entity('users')
export class User {
  // Numeric primary key for database indexing.
  @PrimaryGeneratedColumn()
  id: number;

  // Unique email address used for authentication.
  @Column({ unique: true })
  email: string;

  // Hashed password string, excluded from default queries for security.
  @Column({ select: false })
  password: string;

  // Current access level, defaulting to Viewer permissions.
  @Column({
    type: 'text',
    default: UserRole.VIEWER,
  })
  role: UserRole;

  // The numeric ID for the organization this user belongs to.
  @Column()
  organizationId: number;

  // Timestamps for record creation and last modification.
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

console.log('User schema synchronized with database');