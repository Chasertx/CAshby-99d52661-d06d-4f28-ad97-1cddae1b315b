import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

// Maps the audit log schema to the database table.
@Entity('audit_logs')
export class AuditLogEntity {
  // Unique identifier using UUID format.
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Automatically records the date and time of the entry.
  @CreateDateColumn()
  timestamp: Date;

  // The unique ID of the user performing the action.
  @Column()
  userId: string;

  // The security role of the user at the time of the event.
  @Column()
  userRole: string;

  // The type of operation performed, such as CREATE or DELETE.
  @Column()
  action: string;

  // Additional context or metadata regarding the action.
  @Column()
  details: string;

  // The numeric ID of the organization the log belongs to.
  @Column({ type: 'int' })
  organizationId: number;
}

console.log('Audit system entity registered');