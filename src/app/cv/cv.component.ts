import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CvDataService, Skill } from '../services/cv-data.service';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.scss']
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
