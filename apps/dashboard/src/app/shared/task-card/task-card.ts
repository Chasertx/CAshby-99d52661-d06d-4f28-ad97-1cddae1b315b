import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, UserRole } from '@task-mgmt/shared-data';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.html',
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() userRole: UserRole = UserRole.VIEWER;
  @Output() delete = new EventEmitter<Task>();

  // Validates owner permissions for template-level action visibility
  get isOwner(): boolean {
    return String(this.userRole).toLowerCase() === 'owner';
  }

  // Prevents card click events and signals parent for deletion
  onDelete(event: Event) {
    console.log(`Attempting to delete task: ${this.task.id}`);
    event.stopPropagation();
    this.delete.emit(this.task);
  }
}