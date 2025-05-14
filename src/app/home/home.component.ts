import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../services/auth/auth.service';
import { CvDataService, Skill } from '../services/cv-data.service';
import { GitHubService, GitHubRepo } from '../services/github.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  isSticky = false;
  cvData: any;
  repositories: GitHubRepo[] = [];

  constructor(
    private router: Router, 
    private authService: AuthService,
    private cvDataService: CvDataService,
    private githubService: GitHubService
  ) {}

  ngOnInit() {
    this.cvData = this.cvDataService.getCvData();
    this.loadRepositories();
  }

  private loadRepositories() {
    this.githubService.getAllReposWithReadme().subscribe({
      next: (repos) => {
        this.repositories = repos;
      },
      error: (error) => {
        console.error('Error loading repositories:', error);
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
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
    window.open('https://github.com/Max-Thunderbolt/Equipt', '_blank');
  }

  openRepo(url: string) {
    window.open(url, '_blank');
  }
}
