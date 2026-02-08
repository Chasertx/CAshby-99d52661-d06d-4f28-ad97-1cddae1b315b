import { UserRole } from "./user-role.enum";

// Core user profile with multi-tenant scoping
export interface User {
  id: string;
  email: string;
  role: UserRole;
  organizationId: string;
}

// Data structure for task entities and categorization
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'review' | 'closed';
  category: 'Work' | 'Personal';
  organizationId: number;
  creatorId: string;
  assignee?: string;
}

// System-wide event tracking for security and compliance
export interface AuditLog {
  timestamp: string;
  userId: string;
  userRole: 'Owner' | 'Admin' | 'Viewer'; 
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'ACCESS_DENIED';
  resource: string; 
  resourceId?: string;
  details: string; 
}