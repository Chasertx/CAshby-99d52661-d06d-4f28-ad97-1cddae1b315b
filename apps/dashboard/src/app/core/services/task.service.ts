import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '@task-mgmt/shared-data';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/tasks';

  // State trigger for cross-component board synchronization
  private refreshSubject = new BehaviorSubject<void>(undefined);
  refresh$ = this.refreshSubject.asObservable();

  // Signals components to reload task data
  refreshBoard() {
    console.log('Board sync triggered');
    this.refreshSubject.next();
  }

  // Fetches all tasks from the API
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Persists a new task entry
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Updates specific task fields by ID
  updateTask(id: string, updates: Partial<Task>): Observable<Task> {
    console.log(`Updating task: ${id}`);
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, updates);
  }

  // Removes a task using various ID formats
  deleteTask(taskId: any): Observable<void> {
    const id = taskId?.id || taskId?._id || taskId;
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}