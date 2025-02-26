import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: /* html */ `
    <div class="container" [@fadeIn]>
      <h1>Welcome to My Portfolio</h1>
      <p class="subtitle">Explore my skills, experience, and projects</p>

      <div class="cards-container">
        <div class="card" (click)="navigateToCV()">
          <div class="card-icon">
            <i class="icon-description"></i>
          </div>
          <h2 class="card-title">View CV</h2>
          <p class="card-content">
            Explore my professional experience and skills.
          </p>
          <div class="card-action">
            <button class="btn">VIEW</button>
          </div>
        </div>

        <div class="card" (click)="navigateToChatbot()">
          <div class="card-icon">
            <i class="icon-chat"></i>
          </div>
          <h2 class="card-title">Chat with AI</h2>
          <p class="card-content">
            Interact with an AI assistant to learn more about my experience.
          </p>
          <div class="card-action">
            <button class="btn">CHAT</button>
          </div>
        </div>

        <div class="card" (click)="navigateToGithub()">
          <div class="card-icon">
            <i class="icon-code"></i>
          </div>
          <h2 class="card-title">GitHub Profile</h2>
          <p class="card-content">
            Check out my projects and contributions on GitHub.
          </p>
          <div class="card-action">
            <button class="btn">VISIT</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background-color: #121212;
        color: #f8e6ee;
        padding: 2rem 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
      }

      h1 {
        font-size: 3.5rem;
        margin-bottom: 1rem;
        color: #f8e6ee;
        font-weight: 300;
        letter-spacing: 0.05em;
        text-shadow: 0 0 15px rgba(233, 30, 99, 0.3);
      }

      .subtitle {
        font-size: 1.3rem;
        margin-bottom: 4rem;
        color: #d4b3c4;
        font-weight: 300;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }

      .cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2.5rem;
        padding: 1rem;
      }

      .card {
        background-color: #1e1e1e;
        border: 1px solid rgba(255, 255, 255, 0.05);
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

      .card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          135deg,
          rgba(233, 30, 99, 0.1) 0%,
          rgba(33, 33, 33, 0) 100%
        );
        z-index: 0;
      }

      .card:hover {
        transform: translateY(-12px);
        box-shadow: 0 12px 30px rgba(233, 30, 99, 0.3);
        border-color: rgba(233, 30, 99, 0.3);
      }

      .card:hover::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #e91e63, #ff4081, #e91e63);
        z-index: -1;
        border-radius: 16px;
        filter: blur(14px);
        opacity: 0.7;
        transition: opacity 0.3s ease-in-out;
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
        position: relative;
        z-index: 1;
      }

      .card:hover .card-icon {
        background-color: rgba(233, 30, 99, 0.25);
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 0 20px rgba(233, 30, 99, 0.4);
      }

      .icon-description::before,
      .icon-chat::before,
      .icon-code::before {
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

      .icon-code::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z'/%3E%3C/svg%3E");
      }

      .card-title {
        font-size: 1.8rem;
        margin: 0 0 1rem 0;
        color: #f8e6ee;
        font-weight: 500;
        text-align: center;
        position: relative;
        z-index: 1;
      }

      .card-content {
        color: #d4b3c4;
        line-height: 1.6;
        font-size: 1.1rem;
        margin-bottom: 2rem;
        flex-grow: 1;
        position: relative;
        z-index: 1;
      }

      .card-action {
        margin-top: auto;
        position: relative;
        z-index: 1;
      }

      .btn {
        background-color: transparent;
        color: #ff4081;
        border: 2px solid #ff4081;
        padding: 0.7rem 2.5rem;
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: 2px;
        border-radius: 30px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        z-index: 1;
      }

      .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 0%;
        height: 100%;
        background-color: #ff4081;
        transition: all 0.3s ease;
        z-index: -1;
      }

      .btn:hover {
        color: white;
        box-shadow: 0 0 15px rgba(255, 64, 129, 0.5);
      }

      .btn:hover::before {
        width: 100%;
      }

      @media (max-width: 768px) {
        .container {
          padding: 1rem;
        }

        h1 {
          font-size: 2.5rem;
        }

        .subtitle {
          font-size: 1.1rem;
          margin-bottom: 3rem;
        }

        .card {
          padding: 2rem 1.2rem;
        }
      }
    `,
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '1s cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToCV() {
    this.router.navigate(['/cv']);
  }

  navigateToChatbot() {
    this.router.navigate(['/chatbot']);
  }

  navigateToGithub() {
    window.open('https://github.com/Max-Thunderbolt', '_blank');
  }
}
