import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: /* html */ `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Welcome to your Dashboard</h1>
        <p *ngIf="user">
          Hello, {{ user.email }}
          <span *ngIf="isGoogleUser" class="google-badge">Google Account</span>
        </p>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="navigateToProfile()">Profile</button>
          <button class="btn btn-secondary" (click)="logout()">Logout</button>
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
  `
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