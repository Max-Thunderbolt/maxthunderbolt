import { Injectable } from '@angular/core';

export interface Skill {
  name: string;
  icon: string;
}

export interface Experience {
  company: string;
  position: string;
  period: string;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface Accomplishment {
  title: string;
  items: {
    description: string;
    year: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class CvDataService {
  private readonly cvData = {
    personalInfo: {
      name: 'Max van der Walt',
      title: 'Junior Software Engineer',
      contact: 'max@easefica.co.za | Johannesburg, Gauteng, South Africa',
    },
    summary:
      'Through my studies in Application Development, I have gained strong programming skills across multiple languages, enabling me to develop software solutions for both web and mobile platforms. I have experience in designing and managing databases, ensuring efficient data storage and retrieval. My knowledge of networking and system connectivity allows me to create integrated solutions that function seamlessly. I am also skilled in troubleshooting, testing, and optimizing applications to enhance performance and user experience. Additionally, I have hands-on experience in cloud computing, software customization, and project management, equipping me with the ability to develop, deploy, and maintain scalable applications tailored to specific business needs. I have also gained practical experience as a junior software engineer at EaseFica, where I contribute to software development projects in a professional setting. Furthermore, I have valuable exposure to enterprise-level IT infrastructure. Beyond software development, I have experience teaching IT to students in grades 1-7, which has strengthened my ability to communicate complex technical concepts in a simple and engaging way, reinforcing both my problem-solving and leadership skills.',
    skills: {
      programmingLanguages: [
        { name: 'TypeScript', icon: 'code' },
        { name: 'JavaScript', icon: 'javascript' },
        { name: 'Python', icon: 'code' },
        { name: 'Java', icon: 'code' },
        { name: 'C#', icon: 'code' },
        { name: 'C++', icon: 'code' },
      ],
      frameworks: [
        { name: 'Angular', icon: 'web' },
        { name: '.NET', icon: 'developer_board' },
      ],
      tools: [
        { name: 'Git', icon: 'source_control' },
        { name: 'GitHub', icon: 'merge' },
        { name: 'VS Code', icon: 'code' },
        { name: 'Visual Studio', icon: 'developer_mode' },
        { name: 'IntelliJ', icon: 'integration_instructions' },
        { name: 'Azure', icon: 'cloud' },
        { name: 'Firebase', icon: 'code' },
        { name: 'SSMS', icon: 'storage' },
      ],
      databases: [
        { name: 'SQL Server', icon: 'storage' },
        { name: 'MongoDB', icon: 'storage' },
        { name: 'MySQL', icon: 'storage' },
        { name: 'Oracle', icon: 'storage' },
        { name: 'MySQL Workbench', icon: 'storage' },
      ],
    },
    experience: [
      {
        company: 'Scope IT',
        position: 'Assistant Teacher',
        period: '2024 - Present',
        responsibilities: [
          'Taught grade 1 - 7 IT',
          'Taught CIY afternoon classes',
        ],
      },
      {
        company: 'EaseFica',
        position: 'Junior Software Engineer',
        period: '2025 - Present',
        responsibilities: [],
      },
      {
        company: 'SYSDBA',
        position: 'spot helper',
        period: '2024',
        responsibilities: [
          'Installed and configured a server at E-Lab for Lancet Laboratories',
        ],
      },
    ],
    education: [
      {
        institution: 'Varsity College',
        degree: 'Bachelor of Computer Science in Application Development',
        year: '2025',
      },
      {
        institution: "St John's College",
        degree: 'Matric Certificate (Bachelor`s Pass)',
        year: '2016-2020',
      },
    ],
    accomplishments: [
      {
        title: 'Sports',
        items: [
          {
            description: 'GLRU U/12',
            year: '2014',
          },
          {
            description: 'Most improved backline player @Pirates Rugby Club',
            year: '2018',
          },
          {
            description: 'Won the club rugby league @Pirates Rugby Club',
            year: '2018',
          },
        ],
      },
    ],
    references: [
      {
        name: 'Chris van der Walt',
        position: 'CEO @EaseFica',
        contact: 'chris@easefica.co.za',
      },
      {
        name: 'Cassandra Savides',
        position: ' Director and CEO of Scope IT South Africa',
        contact: '',
      },
      {
        name: 'Chris Bamber',
        position: 'CEO @SYSDBA',
        contact: 'chris.bamber@sysdba.com',
      },
    ],
  };

  getCvData() {
    return this.cvData;
  }

  getCvDataAsString(): string {
    return `
CV: Max van der Walt
Position: Junior Software Engineer
Contact: max@easefica.co.za | Johannesburg, Gauteng, South Africa

PROFESSIONAL SUMMARY:
${this.cvData.summary}

SKILLS:
Programming Languages: ${this.cvData.skills.programmingLanguages
      .map((s) => s.name)
      .join(', ')}
Frameworks: ${this.cvData.skills.frameworks.map((s) => s.name).join(', ')}
Tools: ${this.cvData.skills.tools.map((s) => s.name).join(', ')}
Databases: ${this.cvData.skills.databases.map((s) => s.name).join(', ')}

EXPERIENCE:
${this.cvData.experience
  .map(
    (exp) =>
      `${exp.company} - ${exp.position} (${exp.period})
   ${exp.responsibilities.map((r) => `- ${r}`).join('\n   ')}`
  )
  .join('\n\n')}

EDUCATION:
${this.cvData.education
  .map((edu) => `${edu.institution} - ${edu.degree} (${edu.year})`)
  .join('\n')}

ACCOMPLISHMENTS:
${this.cvData.accomplishments
  .map(
    (acc) =>
      `${acc.title}:
   ${acc.items
     .map((item) => `- ${item.description} (${item.year})`)
     .join('\n   ')}`
  )
  .join('\n\n')}
`;
  }
}
