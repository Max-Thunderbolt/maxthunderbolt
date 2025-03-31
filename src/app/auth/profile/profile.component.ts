import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <h2>Your Profile</h2>
        <p>Manage your account</p>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div *ngIf="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        
        <div *ngIf="user">
          <div class="user-info">
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Account created:</strong> {{ user.metadata.creationTime | date }}</p>
            <p><strong>Last sign in:</strong> {{ user.metadata.lastSignInTime | date }}</p>
            <p *ngIf="isGoogleUser"><strong>Sign-in method:</strong> <span class="google-badge">Google</span></p>
          </div>
          
          <div class="action-buttons">
            <button class="btn-secondary" (click)="navigateToDashboard()">Back to Dashboard</button>
            
            <button *ngIf="!isGoogleUser" class="btn-primary" (click)="resetPassword()" [disabled]="loading">
              {{ loading ? 'Sending...' : 'Reset Password' }}
            </button>
            
            <button class="btn-danger" (click)="confirmLogout()">Logout</button>
          </div>
        </div>
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
    
    .profile-container {
      width: 100%;
      max-width: 550px;
      padding: 2rem;
    }
    
    .profile-card {
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
    
    .user-info {
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid var(--border-color);
    }
    
    .user-info p {
      text-align: left;
      margin-bottom: 0.75rem;
    }
    
    .user-info p:last-child {
      margin-bottom: 0;
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
    
    .success-message {
      background-color: rgba(76, 175, 80, 0.1);
      border: 1px solid rgba(76, 175, 80, 0.3);
      color: #4caf50;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }
    
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
    
    .btn-secondary {
      background-color: transparent;
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
    }
    
    .btn-secondary:hover {
      background-color: rgba(233, 30, 99, 0.1);
    }
    
    .btn-danger {
      background-color: #f44336;
      color: white;
    }
    
    .btn-danger:hover {
      background-color: #d32f2f;
      transform: translateY(-2px);
    }
    
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .google-badge {
      display: inline-flex;
      align-items: center;
      background-color: rgba(66, 133, 244, 0.1);
      color: #4285F4;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid rgba(66, 133, 244, 0.3);
    }
    
    .google-badge::before {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%234285F4' d='M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z'/%3E%3Cpath fill='%2334A853' d='M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z'/%3E%3Cpath fill='%23FBBC05' d='M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z'/%3E%3Cpath fill='%23EA4335' d='M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z'/%3E%3Cpath fill='none' d='M2 2h44v44H2z'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      margin-right: 6px;
    }
    
    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }
      
      .profile-card {
        padding: 1.5rem 1rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  isGoogleUser = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get current user information
    this.authService.authState$.subscribe(state => {
      if (!state.isAuthenticated) {
        this.router.navigate(['/login']);
        return;
      }
      
      this.user = state.user;
      
      // Check if user signed in with Google
      if (this.user && this.user.providerData && this.user.providerData.length > 0) {
        this.isGoogleUser = this.user.providerData[0].providerId === 'google.com';
      }
    });
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToChatbot(): void {
    this.router.navigate(['/chatbot']);
  }

  resetPassword(): void {
    if (!this.user?.email) return;
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.resetPassword(this.user.email)
      .subscribe({
        next: () => {
          this.successMessage = 'Password reset email sent. Please check your inbox.';
          this.loading = false;
        },
        error: error => {
          this.errorMessage = error.message || 'Error sending password reset email.';
          this.loading = false;
        }
      });
  }

  confirmLogout(): void {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logout().subscribe();
    }
  }
} 