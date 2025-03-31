import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CvDataService, Skill } from '../services/cv-data.service';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cv.component.html',
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

      .skill-chip i {
        color: var(--primary-color);
        font-size: 1.2rem;
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

  getIconInfo(skill: Skill): { class: string, prefix: string } {
    // Mapping for all programming languages and technologies with appropriate Font Awesome icons
    const iconMap: {[key: string]: { class: string, prefix: string }} = {
      // Programming Languages
      'TypeScript': { class: 'fa-js-square', prefix: 'fab' },
      'JavaScript': { class: 'fa-js', prefix: 'fab' },
      'Python': { class: 'fa-python', prefix: 'fab' },
      'Java': { class: 'fa-java', prefix: 'fab' },
      'C#': { class: 'fa-microsoft', prefix: 'fab' },
      'C++': { class: 'fa-file-code', prefix: 'fas' },
      'Kotlin': { class: 'fa-android', prefix: 'fab' },
      'HTML': { class: 'fa-html5', prefix: 'fab' },
      'CSS': { class: 'fa-css3-alt', prefix: 'fab' },
      'SQL': { class: 'fa-database', prefix: 'fas' },
      
      // Frameworks
      'Angular': { class: 'fa-angular', prefix: 'fab' },
      '.NET': { class: 'fa-microsoft', prefix: 'fab' },
      
      // Tools
      'Git': { class: 'fa-git-alt', prefix: 'fab' },
      'GitHub': { class: 'fa-github', prefix: 'fab' },
      'VS Code': { class: 'fa-file-code', prefix: 'fas' },
      'Visual Studio': { class: 'fa-microsoft', prefix: 'fab' },
      'IntelliJ': { class: 'fa-java', prefix: 'fab' },
      'Azure': { class: 'fa-cloud', prefix: 'fas' },
      'Firebase': { class: 'fa-fire', prefix: 'fas' },
      'SSMS': { class: 'fa-database', prefix: 'fas' },
      'Postman': { class: 'fa-paper-plane', prefix: 'fas' },
      
      // Databases
      'SQL Server': { class: 'fa-database', prefix: 'fas' },
      'MongoDB': { class: 'fa-database', prefix: 'fas' },
      'MySQL': { class: 'fa-database', prefix: 'fas' },
      'Oracle': { class: 'fa-database', prefix: 'fas' },
      'MySQL Workbench': { class: 'fa-database', prefix: 'fas' }
    };
    
    // First try to find by skill name (most accurate)
    if (iconMap[skill.name]) {
      return iconMap[skill.name];
    }
    
    // Fallback mappings for generic icon types
    const fallbackMap: {[key: string]: { class: string, prefix: string }} = {
      'code': { class: 'fa-code', prefix: 'fas' },
      'javascript': { class: 'fa-js', prefix: 'fab' },
      'typescript': { class: 'fa-js-square', prefix: 'fab' },
      'python': { class: 'fa-python', prefix: 'fab' },
      'java': { class: 'fa-java', prefix: 'fab' },
      'csharp': { class: 'fa-microsoft', prefix: 'fab' },
      'cpp': { class: 'fa-file-code', prefix: 'fas' },
      'kotlin': { class: 'fa-android', prefix: 'fab' },
      'html': { class: 'fa-html5', prefix: 'fab' },
      'css': { class: 'fa-css3-alt', prefix: 'fab' },
      'database': { class: 'fa-database', prefix: 'fas' },
      'web': { class: 'fa-angular', prefix: 'fab' },
      'developer_board': { class: 'fa-microsoft', prefix: 'fab' },
      'source_control': { class: 'fa-git-alt', prefix: 'fab' },
      'merge': { class: 'fa-github', prefix: 'fab' },
      'developer_mode': { class: 'fa-file-code', prefix: 'fas' },
      'integration_instructions': { class: 'fa-java', prefix: 'fab' },
      'cloud': { class: 'fa-cloud', prefix: 'fas' },
      'fire': { class: 'fa-fire', prefix: 'fas' },
      'storage': { class: 'fa-database', prefix: 'fas' }
    };
    
    // Try to find by icon type
    if (fallbackMap[skill.icon]) {
      return fallbackMap[skill.icon];
    }
    
    // Default fallback
    return { class: 'fa-code', prefix: 'fas' };
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
