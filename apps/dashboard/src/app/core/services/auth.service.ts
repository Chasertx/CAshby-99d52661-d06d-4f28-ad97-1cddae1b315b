import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserRole } from '@task-mgmt/shared-data';

// Manages authentication state and user permissions.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private roleSubject = new BehaviorSubject<UserRole>(UserRole.VIEWER);
  
  // Stream for components to react to permission changes.
  userRole$ = this.roleSubject.asObservable();
  
  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('user');
    // Checks storage on boot to keep the user logged in.
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.roleSubject.next(user.role.toLowerCase() as UserRole);
      } catch (e) {
        console.log('Session recovery failed, resetting to viewer.');
        this.roleSubject.next(UserRole.VIEWER);
      }
    } else {
      this.roleSubject.next(UserRole.VIEWER);
    }
  }

  setRole(role: UserRole) {
    this.roleSubject.next(role);
  }

  // Persists a new role and updates the local security token.
  updateUserRole(newRole: UserRole): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update-role`, { role: newRole }).pipe(
      tap((res: any) => {
        const newToken = res?.access_token;
        if (newToken && typeof newToken === 'string') {
          localStorage.setItem('auth_token', newToken);
        }
        this.setRole(newRole);
      })
    );
  }

  // Sends new user data to the server and initializes the session.
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => {
        if (res.access_token) {
          this.handleAuthSuccess(res);
        }
      })
    );
  }

  // Authenticates credentials and starts the user session.
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  // Saves tokens and user metadata to local storage.
  public handleAuthSuccess(res: any): void {
    if (res && res.access_token) {
      localStorage.setItem('auth_token', res.access_token);
      
      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
        const role = res.user.role.toLowerCase() as UserRole;
        this.roleSubject.next(role);
        
        console.log('User identity verified. Access granted.');
      }
    }
  }

  // Refreshes the local role data from the server.
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
      tap(res => {
        if (res.role) {
          const role = res.role.toLowerCase() as UserRole;
          this.roleSubject.next(role);
          
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.role = role;
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Clears all session data and resets permissions.
  logout() {
    console.log('Cleaning up session. See ya.');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.roleSubject.next(UserRole.VIEWER);
  }
}