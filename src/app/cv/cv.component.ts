import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CvDataService, Skill } from '../services/cv-data.service';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule],
  template: /* html */ `
    <div class="cv-container">
      <button class="back-button" (click)="goBack()">
        <i class="icon-back"></i>
      </button>

      <header class="cv-header">
        <h1>{{ cvData.personalInfo.name }}</h1>
        <h2>{{ cvData.personalInfo.title }}</h2>
        <p>{{ cvData.personalInfo.contact }}</p>
      </header>

      <section class="cv-section">
        <h3>Professional Summary</h3>
        <p>
          {{ cvData.summary }}
        </p>
      </section>

      <div class="divider"></div>

      <section class="cv-section">
        <h3>Skills</h3>
        <div class="skills-container">
          <h4>Programming Languages</h4>
          <div class="skill-chips">
            <div class="skill-chip" *ngFor="let skill of programmingLanguages">
              <i class="skill-icon" [ngClass]="'icon-' + skill.icon"></i>
              {{ skill.name }}
            </div>
          </div>

          <h4>Frameworks & Libraries</h4>
          <div class="skill-chips">
            <div class="skill-chip" *ngFor="let skill of frameworks">
              <i class="skill-icon" [ngClass]="'icon-' + skill.icon"></i>
              {{ skill.name }}
            </div>
          </div>

          <h4>Tools & Technologies</h4>
          <div class="skill-chips">
            <div class="skill-chip" *ngFor="let skill of tools">
              <i class="skill-icon" [ngClass]="'icon-' + skill.icon"></i>
              {{ skill.name }}
            </div>
          </div>

          <h4>Databases</h4>
          <div class="skill-chips">
            <div class="skill-chip" *ngFor="let skill of databases">
              <i class="skill-icon" [ngClass]="'icon-' + skill.icon"></i>
              {{ skill.name }}
            </div>
          </div>
        </div>
      </section>

      <div class="divider"></div>

      <section class="cv-section">
        <h3>Experience</h3>
        <div class="experience-item" *ngFor="let exp of cvData.experience">
          <h4>{{ exp.company }}</h4>
          <p class="position">{{ exp.position }}</p>
          <p class="date">{{ exp.period }}</p>
          <ul>
            <li *ngFor="let responsibility of exp.responsibilities">
              {{ responsibility }}
            </li>
          </ul>
        </div>
      </section>

      <div class="divider"></div>

      <section class="cv-section">
        <h3>Education</h3>
        <div class="education-item" *ngFor="let edu of cvData.education">
          <h4>{{ edu.institution }}</h4>
          <p class="degree">{{ edu.degree }}</p>
          <p class="date">{{ edu.year }}</p>
        </div>
      </section>

      <div class="divider"></div>

      <section class="cv-section">
        <h3>References</h3>
        <div class="experience-item" *ngFor="let ref of cvData.references">
          <h4>{{ ref.name }}</h4>
          <p class="position">{{ ref.position }}</p>
          <p class="date">{{ ref.contact }}</p>
        </div>
      </section>

      <div class="divider"></div>

      <section class="cv-section">
        <h3>Further Accomplishments</h3>
        <div class="experience-item" *ngFor="let acc of cvData.accomplishments">
          <h4>{{ acc.title }}</h4>
          <ul>
            <li *ngFor="let item of acc.items">
              <p class="position">{{ item.description }}</p>
              <p class="date">{{ item.year }}</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background-color: var(--background-dark);
        color: var(--text-primary);
      }

      .cv-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        position: relative;
      }

      .back-button {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: transparent;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .back-button:hover {
        background-color: rgba(233, 30, 99, 0.1);
        transform: scale(1.1);
      }

      .icon-back {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
      }

      .cv-header {
        text-align: center;
        margin-bottom: 2rem;
        padding-top: 2rem;
      }

      .cv-header h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }

      .cv-header h2 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--primary-color);
      }

      .cv-section {
        margin-bottom: 2rem;
      }

      .cv-section h3 {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        color: var(--primary-color);
      }

      .cv-section h4 {
        font-size: 1.4rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }

      .divider {
        height: 1px;
        background-color: rgba(255, 255, 255, 0.1);
        margin: 2rem 0;
      }

      .skills-container {
        display: grid;
        gap: 1.5rem;
      }

      .skill-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        margin-bottom: 1rem;
      }

      .skill-chip {
        background-color: var(--background-card);
        color: var(--text-primary);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
      }

      .skill-chip:hover {
        background-color: rgba(233, 30, 99, 0.1);
        border-color: var(--primary-light);
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(233, 30, 99, 0.2);
      }

      .skill-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      .icon-code {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z'/%3E%3C/svg%3E");
      }

      .icon-javascript {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z'/%3E%3C/svg%3E");
      }

      .icon-web {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z'/%3E%3C/svg%3E");
      }

      .icon-developer_board {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 13h5v4H6zm6-6h4v3h-4zm0 4h4v6h-4zm-6-3h5v2H6z'/%3E%3C/svg%3E");
      }

      .icon-source_control,
      .icon-merge,
      .icon-developer_mode,
      .icon-integration_instructions,
      .icon-cloud,
      .icon-storage {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z'/%3E%3C/svg%3E");
      }

      .experience-item,
      .education-item {
        margin-bottom: 1.5rem;
        padding: 1rem;
        background-color: var(--background-card);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.3s ease;
      }

      .experience-item:hover,
      .education-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        border-color: rgba(233, 30, 99, 0.2);
      }

      .position,
      .degree {
        color: var(--primary-color);
        font-weight: 500;
        margin: 0.5rem 0;
      }

      .date {
        color: var(--text-secondary);
        font-style: italic;
        margin-bottom: 0.5rem;
      }

      ul {
        padding-left: 1.5rem;
        color: var(--text-secondary);
      }

      .reflection-text {
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 1rem 0;
      }

      @media (max-width: 768px) {
        .cv-container {
          padding: 1rem;
        }

        .cv-header h1 {
          font-size: 2rem;
        }

        .cv-header h2 {
          font-size: 1.2rem;
        }

        .skill-chips {
          justify-content: center;
        }
      }
    `,
  ],
})
export class CvComponent {
  cvData: any;
  programmingLanguages: Skill[] = [];
  frameworks: Skill[] = [];
  tools: Skill[] = [];
  databases: Skill[] = [];

  constructor(private router: Router, private cvDataService: CvDataService) {
    this.cvData = this.cvDataService.getCvData();
    this.programmingLanguages = this.cvData.skills.programmingLanguages;
    this.frameworks = this.cvData.skills.frameworks;
    this.tools = this.cvData.skills.tools;
    this.databases = this.cvData.skills.databases;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
