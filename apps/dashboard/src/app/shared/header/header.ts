import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRole } from '@task-mgmt/shared-data';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  readonly UserRole = UserRole;
  private authService = inject(AuthService);
  
  role$ = this.authService.userRole$;

  @Input() role: UserRole = UserRole.VIEWER;
  
  @Output() createTask = new EventEmitter<void>();
  @Output() roleChanged = new EventEmitter<UserRole>();
  @Output() logout = new EventEmitter<void>();

  // Updates backend state and notifies parent of permission changes
  setRole(newRole: UserRole) {
    this.authService.updateUserRole(newRole).subscribe({
      next: () => {
        console.log(`Role updated to: ${newRole}`);
        this.roleChanged.emit(newRole);
      },
      error: (err: any) => console.error('Role sync failed', err)
    });
  }

  // Notifies parent to open task creation modal
  onAddNewTask() {
    this.createTask.emit();
  }

  // Terminates session and triggers logout navigation
  onLogout() {
    console.log('User logging out');
    this.authService.logout();
    this.logout.emit();
  }
}