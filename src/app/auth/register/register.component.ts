import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Create Account</h2>
        <p>Register to access the chatbot</p>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              placeholder="Enter your email"
              [ngClass]="{'invalid': submitted && f['email'].errors}"
            />
            <div *ngIf="submitted && f['email'].errors" class="error-text">
              <span *ngIf="f['email'].errors['required']">Email is required</span>
              <span *ngIf="f['email'].errors['email']">Email is invalid</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              placeholder="Create a password"
              [ngClass]="{'invalid': submitted && f['password'].errors}"
            />
            <div *ngIf="submitted && f['password'].errors" class="error-text">
              <span *ngIf="f['password'].errors['required']">Password is required</span>
              <span *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              formControlName="confirmPassword" 
              placeholder="Confirm your password"
              [ngClass]="{'invalid': submitted && f['confirmPassword'].errors}"
            />
            <div *ngIf="submitted && f['confirmPassword'].errors" class="error-text">
              <span *ngIf="f['confirmPassword'].errors['required']">Please confirm your password</span>
              <span *ngIf="f['confirmPassword'].errors['mustMatch']">Passwords must match</span>
            </div>
          </div>
          
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>
          
          <div class="separator">
            <span>OR</span>
          </div>
          
          <button type="button" class="btn-google" (click)="registerWithGoogle()" [disabled]="loading">
            <span class="google-icon"></span>
            Continue with Google
          </button>
          
          <p class="auth-link">
            Already have an account? <a routerLink="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--background-dark);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .auth-container {
      width: 100%;
      max-width: 450px;
      padding: 2rem;
    }
    
    .auth-card {
      background-color: var(--background-card);
      border-radius: 12px;
      padding: 2.5rem 2rem;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border-color);
    }
    
    h2 {
      color: var(--text-primary);
      font-size: 2rem;
      margin-bottom: 0.5rem;
      text-align: center;
    }
    
    p {
      color: var(--text-secondary);
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    label {
      color: var(--text-primary);
      font-weight: 500;
    }
    
    input {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background-color: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    input:focus {
      border-color: var(--primary-color);
      outline: none;
      box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.2);
    }
    
    input.invalid {
      border-color: #e91e63;
      background-color: rgba(233, 30, 99, 0.05);
    }
    
    .error-text {
      color: #e91e63;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .error-message {
      background-color: rgba(233, 30, 99, 0.1);
      border: 1px solid rgba(233, 30, 99, 0.3);
      color: #e91e63;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }
    
    button {
      padding: 0.875rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-primary {
      background-color: var(--primary-color);
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: var(--primary-dark);
      transform: translateY(-2px);
    }
    
    .btn-google {
      background-color: white;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #ddd;
    }
    
    .btn-google:hover:not(:disabled) {
      background-color: #f8f8f8;
      transform: translateY(-2px);
    }
    
    .google-icon {
      display: block;
      width: 18px;
      height: 18px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/%3E%3Cpath fill='%234285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/%3E%3Cpath fill='%23FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/%3E%3Cpath fill='%2334A853' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/%3E%3Cpath fill='none' d='M0 0h48v48H0z'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
    }
    
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .separator {
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--text-secondary);
      margin: 0.5rem 0;
    }
    
    .separator::before,
    .separator::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--border-color);
    }
    
    .separator span {
      padding: 0 0.75rem;
      font-size: 0.875rem;
    }
    
    .auth-link {
      margin-top: 1rem;
      font-size: 0.875rem;
      text-align: center;
    }
    
    .auth-link a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }
    
    .auth-link a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .auth-container {
        padding: 1rem;
      }
      
      .auth-card {
        padding: 1.5rem 1rem;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { 
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    this.authService.authState$.subscribe(state => {
      if (state.isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  // Custom validator to check if passwords match
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // Return if another validator has already found an error
        return;
      }

      // Set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: error => {
          this.errorMessage = error.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
  }

  registerWithGoogle(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.loginWithGoogle()
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: error => {
          this.errorMessage = error.message || 'Google sign-up failed. Please try again.';
          this.loading = false;
        },
        complete: () => {
          // For redirect method on mobile, we won't get here before the page reloads
          this.loading = false;
        }
      });
  }
} 