import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Welcome to your Dashboard</h1>
        <p *ngIf="user">
          Hello, {{ user.email }}
          <span *ngIf="isGoogleUser" class="google-badge">Google Account</span>
        </p>
        <div class="header-actions">
          <button class="btn-primary" (click)="navigateToProfile()">Profile</button>
          <button class="btn-secondary" (click)="logout()">Logout</button>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="cards-container">
          <div class="card" (click)="navigateToChatbot()">
            <div class="card-icon">
              <i class="icon-chat"></i>
            </div>
            <h2 class="card-title">Chat Assistant</h2>
            <p class="card-content">
              Chat with an assistant to learn more about Max's skills and experience and to get in touch with him.
            </p>
            <div class="card-action">
              <button class="btn">CHAT NOW</button>
            </div>
          </div>

          <div class="card" (click)="navigateToCV()">
            <div class="card-icon">
              <i class="icon-description"></i>
            </div>
            <h2 class="card-title">View CV</h2>
            <p class="card-content">
              Explore Max's professional experience, education, and skills.
            </p>
            <div class="card-action">
              <button class="btn">VIEW CV</button>
            </div>
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
    }

    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background-color: var(--background-card);
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border-color);
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      font-weight: 300;
    }

    .dashboard-header p {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
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

    .header-actions {
      display: flex;
      justify-content: center;
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

    .btn-primary:hover {
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

    .cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2.5rem;
      padding: 1rem;
    }

    .card {
      background-color: var(--background-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      height: 100%;
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2.5rem 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      position: relative;
      overflow: hidden;
    }

    .card:hover {
      transform: translateY(-12px);
      box-shadow: 0 12px 30px rgba(233, 30, 99, 0.3);
      border-color: rgba(233, 30, 99, 0.3);
    }

    .card-icon {
      background-color: rgba(233, 30, 99, 0.15);
      border-radius: 50%;
      width: 90px;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
    }

    .card:hover .card-icon {
      background-color: rgba(233, 30, 99, 0.25);
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 0 20px rgba(233, 30, 99, 0.4);
    }

    .icon-description::before,
    .icon-chat::before {
      content: '';
      display: block;
      width: 40px;
      height: 40px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      filter: drop-shadow(0 0 5px rgba(233, 30, 99, 0.5));
    }

    .icon-description::before {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z'/%3E%3C/svg%3E");
    }

    .icon-chat::before {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z'/%3E%3C/svg%3E");
    }

    .card-title {
      font-size: 1.8rem;
      margin: 0 0 1rem 0;
      color: var(--text-primary);
      font-weight: 500;
      text-align: center;
    }

    .card-content {
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 1.1rem;
      margin-bottom: 2rem;
      text-align: center;
      flex-grow: 1;
    }

    .card-action {
      margin-top: auto;
    }

    .btn {
      background-color: transparent;
      color: var(--primary-color);
      border: 2px solid var(--primary-color);
      padding: 0.7rem 2.5rem;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 2px;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn:hover {
      background-color: var(--primary-color);
      color: white;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .dashboard-header {
        padding: 1.5rem 1rem;
      }

      .dashboard-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: any = null;
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

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToChatbot(): void {
    this.router.navigate(['/chatbot']);
  }

  navigateToCV(): void {
    this.router.navigate(['/cv']);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
} 