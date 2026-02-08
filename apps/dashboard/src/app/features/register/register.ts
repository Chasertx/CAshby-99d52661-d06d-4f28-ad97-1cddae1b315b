import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Short comment: Standard registration schema; must match HTML formControlNames.
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['viewer', Validators.required],
      organizationId: [1, [Validators.required, Validators.min(1)]]
    });
  }

  // Short comment: Handles registration and hydrates local state to prevent Guard crashes.
 // Short comment: Submits registration and hydrates service state before redirecting.
onSubmit() {
  if (this.registerForm.invalid) return;

  this.loading = true;
  this.errorMessage = '';

  this.authService.register(this.registerForm.value).subscribe({
    next: (res) => {
      // Short comment: Crucial step to prevent guard crashes in image_97a4bf.jpg.
      this.authService.handleAuthSuccess(res);
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      console.error('Registration error', err);
      this.loading = false;
      this.errorMessage = 'Registration failed. Please try again.';
    }
  });
}
}