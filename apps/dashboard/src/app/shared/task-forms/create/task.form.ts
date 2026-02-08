import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task } from '@task-mgmt/shared-data';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task.form.html'
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  
  @Output() taskCreated = new EventEmitter<Partial<Task>>();
  @Output() close = new EventEmitter<void>();

  // Form structure with validation and initial states
  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''], 
    assignee: [''],    
    category: ['Work'],
    status: ['open']
  });

  // Validates form data before emitting and resetting state
  submit() {
    if (this.taskForm.valid) {
      console.log('Emitting new task data');
      this.taskCreated.emit(this.taskForm.value as Partial<Task>);
      
      this.taskForm.reset({ 
        category: 'Work', 
        status: 'open' 
      });
    } else {
      console.warn('Form submission attempted with invalid fields');
    }
  }
}