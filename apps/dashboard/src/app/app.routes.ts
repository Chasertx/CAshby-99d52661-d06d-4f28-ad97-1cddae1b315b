import { Routes } from '@angular/router';
import { UserRole } from '@task-mgmt/shared-data';
import { authGuard } from '@task-mgmt/shared-auth-angular';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./features/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login-page').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    // Defines permitted roles for the authGuard validation
    data: { roles: [UserRole.ADMIN, UserRole.OWNER, UserRole.VIEWER] }, 
    loadComponent: () => import('./features/kanban/kanban-board').then((m) => m.KanbanBoardComponent),
  },
  // Default entry point for authenticated users
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  // Fallback route for undefined paths
  { path: '**', redirectTo: 'login' }
];