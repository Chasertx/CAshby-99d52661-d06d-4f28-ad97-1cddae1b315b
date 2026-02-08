import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { TaskService } from './core/services/task.service';
import { UserRole, Task } from '@task-mgmt/shared-data';
import { HeaderComponent } from './shared/header/header';
import { TaskFormComponent } from './shared/task-forms/create/task.form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, TaskFormComponent],
  templateUrl: './app.html',
})
export class AppComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  public router = inject(Router);

  currentRole: UserRole = UserRole.VIEWER;
  isInitialLoadComplete = false;
  showCreateModal = false;

  ngOnInit() {
    // Subscribes to role stream to keep UI permissions in sync
    this.authService.userRole$.subscribe((role) => {
      this.currentRole = role;
    });

    this.checkUserStatus();
  }

  // Persists task and triggers a board refresh on the next event loop tick
  handleTaskCreated(taskData: Partial<Task>) {
    this.taskService.createTask(taskData).subscribe({
      next: () => {
        console.log('Task saved successfully');
        this.showCreateModal = false; 
        this.cdr.detectChanges(); 
        setTimeout(() => {
          this.taskService.refreshBoard();
        }, 0);
      },
      error: (err) => console.error('Task sync error:', err)
    });
  }

  // Activates the task creation modal overlay
  addNewTask() {
    this.showCreateModal = true;
  }

  // Validates existing session and fetches profile if token exists
  checkUserStatus() {
    if (this.isLoginPage) {
      this.isInitialLoadComplete = true;
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (token) {
      this.authService.getProfile().subscribe({
        next: () => (this.isInitialLoadComplete = true),
        error: () => this.onLogout(),
      });
    } else {
      this.isInitialLoadComplete = true;
      this.onLogout();
    }
  }

  // Helper to identify if the current route is a public auth page
  get isLoginPage(): boolean {
    const publicRoutes = ['/login', '/register', '/admin'];
    return publicRoutes.some(route => this.router.url.includes(route));
  }

  // Returns tailwind gradient classes based on current navigation state
  getBackgroundClass(): string {
    if (this.isLoginPage) return 'from-slate-900 to-black';
    return 'from-indigo-950 via-slate-900 to-black';
  }

  // Updates global user role permissions
  handleRoleChange(role: UserRole) {
    this.authService.setRole(role);
  }

  // Clears session storage and redirects to the login view
  onLogout() {
    console.log('Clearing session data');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    if (!this.isLoginPage) {
      this.router.navigate(['/login']);
    }
  }
}