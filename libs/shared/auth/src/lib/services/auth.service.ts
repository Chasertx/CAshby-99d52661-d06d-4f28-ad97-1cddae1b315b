import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { UserRole } from '../../../../data/src/lib/user-role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Reactive state for current user permissions
  private roleSignal = signal<UserRole>(UserRole.VIEWER);

  // Observable stream for component subscriptions
  userRole$ = toObservable(this.roleSignal);

  // Synchronous access to the current role value
  get currentRole(): UserRole {
    return this.roleSignal();
  }

  // Updates active role and triggers UI permission changes
  setRole(role: UserRole) {
    console.log(`Auth state updated: ${role}`);
    this.roleSignal.set(role);
  }

  // Validates presence of session token in storage
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Clears session and resets role to default viewer
  logout() {
    console.log('Session terminated');
    localStorage.removeItem('token');
    this.roleSignal.set(UserRole.VIEWER);
  }
}