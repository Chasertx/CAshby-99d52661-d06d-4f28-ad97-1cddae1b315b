import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { Task, UserRole } from '@task-mgmt/shared-data';
import { TaskCardComponent } from '../../shared/task-card/task-card';

type LocalStatus = 'open' | 'in-progress' | 'review' | 'closed';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskCardComponent],
  templateUrl: './kanban-board.html',
})
export class KanbanBoardComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  boardData: { [key: string]: Task[] } = {
    open: [],
    'in-progress': [],
    review: [],
    closed: [],
  };

  userRole: UserRole = UserRole.VIEWER;
  private roleSub?: Subscription;

  readonly Statuses: { id: LocalStatus; label: string }[] = [
    { id: 'open', label: 'Open' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'review', label: 'Review' },
    { id: 'closed', label: 'Closed' },
  ];

  get allStatusIds() {
    return this.Statuses.map((s) => s.id);
  }

  ngOnInit() {
    // Reloads board data when a refresh signal is emitted
    this.taskService.refresh$.subscribe(() => {
      console.log('Board refresh requested');
      setTimeout(() => this.loadBoard());
    });

    // Synchronizes component state with user permissions
    this.roleSub = this.authService.userRole$.subscribe((role) => {
      this.userRole = role;
      this.cdr.detectChanges();
    });
  }

  // Maps flat task array into categorized board columns
  loadBoard() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.Statuses.forEach((status) => {
          this.boardData[status.id] = tasks.filter((t) => t.status === status.id);
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Load error', err)
    });
  }

  // Submits new task and triggers full board reload
  handleCreateTask(taskData: any) {
    this.taskService.createTask(taskData).subscribe({
      next: () => this.loadBoard(),
      error: (err) => console.error('Creation error', err)
    });
  }

  // Handles card moves and persists status changes to DB
  onDrop(event: CdkDragDrop<Task[]>, newStatus: string) {
    const task = event.item.data as Task;
    if (!task?.id) return;

    if (event.previousContainer !== event.container) {
      console.log(`Moving task ${task.id} to ${newStatus}`);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.taskService.updateTask(task.id, { status: newStatus as any }).subscribe({
        next: () => this.taskService.refreshBoard(),
        error: (err) => {
          console.error('Update error', err);
          this.taskService.refreshBoard();
        }
      });
    }
  }

  // Deletes task and refreshes UI on success
  handleDelete(task: Task) {
    if (!task.id) return;
    this.taskService.deleteTask(task.id).subscribe({
      next: () => this.loadBoard(),
      error: (err) => console.error('Deletion error', err)
    });
  }

  ngOnDestroy() {
    this.roleSub?.unsubscribe();
  }
}