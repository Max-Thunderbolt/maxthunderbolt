import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../services/auth/auth.service';
import { CvDataService, Skill } from '../services/cv-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: /* html */ `
    <header class="main-header" [class.sticky]="isSticky">
      <nav class="nav-container">
        <div class="logo">
          <span>{{ cvData.personalInfo.name }}</span>
        </div>
        <div class="nav-links">
          <a href="#about" class="nav-link">About</a>
          <a href="#projects" class="nav-link">Projects</a>
          <a href="#skills" class="nav-link">Skills</a>
          <a href="#contact" class="nav-link">Contact</a>
        </div>
      </nav>
    </header>

    <main>
      <!-- Hero Section -->
      <section id="hero" class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Welcome to My Portfolio</h1>
          <p class="hero-subtitle">{{ cvData.personalInfo.title }}</p>
          <div class="hero-cta">
            <button class="btn btn-primary" (click)="navigateToCV()">View CV</button>
            <button class="btn btn-secondary" (click)="navigateToChatbot()">Chat with Me</button>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="section">
        <div class="container">
          <h2 class="section-title">About Me</h2>
          <div class="about-content">
            <div class="about-text">
              <p>{{ cvData.summary }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects Section -->
      <section id="projects" class="section">
        <div class="container">
          <h2 class="section-title">Featured Projects</h2>
          <div class="projects-grid">
            <div class="project-card" (click)="navigateToEquipt()">
              <div class="project-image">
                <div class="project-overlay">
                  <div class="project-tech">
                    <span>Angular</span>
                    <span>Firebase</span>
                    <span>TypeScript</span>
                  </div>
                </div>
              </div>
              <div class="project-info">
                <h3>Equipt Project</h3>
                <p>Project management web application built with Firebase</p>
                <button class="btn">View Project</button>
              </div>
            </div>

            <div class="project-card" (click)="navigateToGithub()">
              <div class="project-image">
                <div class="project-overlay">
                  <div class="project-tech">
                    <span>GitHub</span>
                    <span>Open Source</span>
                  </div>
                </div>
              </div>
              <div class="project-info">
                <h3>GitHub Profile</h3>
                <p>Explore my open-source contributions and projects</p>
                <button class="btn">Visit Profile</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Skills Section -->
      <section id="skills" class="section">
        <div class="container">
          <h2 class="section-title">Skills & Expertise</h2>
          <div class="skills-grid">
            <div class="skill-category">
              <h3>Programming Languages</h3>
              <div class="skill-items">
                <span class="skill-item" *ngFor="let skill of cvData.skills.programmingLanguages">
                  {{ skill.name }}
                </span>
              </div>
            </div>
            <div class="skill-category">
              <h3>Frameworks & Tools</h3>
              <div class="skill-items">
                <span class="skill-item" *ngFor="let skill of cvData.skills.frameworks">
                  {{ skill.name }}
                </span>
                <span class="skill-item" *ngFor="let skill of cvData.skills.tools">
                  {{ skill.name }}
                </span>
              </div>
            </div>
            <div class="skill-category">
              <h3>Databases</h3>
              <div class="skill-items">
                <span class="skill-item" *ngFor="let skill of cvData.skills.databases">
                  {{ skill.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Experience Section -->
      <section id="experience" class="section">
        <div class="container">
          <h2 class="section-title">Experience</h2>
          <div class="experience-grid">
            <div class="experience-card" *ngFor="let exp of cvData.experience">
              <h3>{{ exp.position }}</h3>
              <h4>{{ exp.company }}</h4>
              <p class="period">{{ exp.period }}</p>
              <ul class="responsibilities">
                <li *ngFor="let resp of exp.responsibilities">{{ resp }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="section">
        <div class="container">
          <h2 class="section-title">Get in Touch</h2>
          <div class="contact-content">
            <p>{{ cvData.personalInfo.contact }}</p>
            <div class="contact-actions">
              <button class="btn btn-primary" (click)="navigateToChatbot()">Chat with Me</button>
              <a [href]="'mailto:' + cvData.personalInfo.contact.split(' | ')[0]" class="btn btn-secondary">Email Me</a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="main-footer">
      <div class="container">
        <div class="footer-content">
          <p>&copy; 2024 {{ cvData.personalInfo.name }}. All rights reserved.</p>
          <div class="social-links">
            <a href="https://github.com/Max-Thunderbolt" target="_blank" class="social-link">
              <i class="fab fa-github"></i>
            </a>
            <a href="https://linkedin.com/in/your-profile" target="_blank" class="social-link">
              <i class="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  isSticky = false;
  cvData: any;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private cvDataService: CvDataService
  ) {}

  ngOnInit() {
    this.cvData = this.cvDataService.getCvData();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isSticky = window.scrollY > 50;
  }

  navigateToCV() {
    this.router.navigate(['/cv']);
  }

  navigateToChatbot() {
    this.authService.authState$.subscribe(state => {
      if (state.isAuthenticated) {
        this.router.navigate(['/chatbot']);
      } else {
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: '/chatbot' } 
        });
      }
    });
  }

  navigateToGithub() {
    window.open('https://github.com/Max-Thunderbolt', '_blank');
  }

  navigateToEquipt() {
    window.open('https://equipt-d6408.firebaseapp.com/', '_blank');
  }
}
