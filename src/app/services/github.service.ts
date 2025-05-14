import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap, catchError, of } from 'rxjs';

export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  topics: string[];
  language: string;
  readme: string;
  default_branch: string;
}

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private readonly username = 'Max-Thunderbolt';
  private readonly apiUrl = `https://api.github.com/users/${this.username}/repos`;
  private readonly rawContentUrl = 'https://raw.githubusercontent.com';

  constructor(private http: HttpClient) {}

  getRepositories(): Observable<GitHubRepo[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(repos => repos.filter(repo => !repo.fork)), // Filter out forked repositories
      map(repos => repos.map(repo => ({
        name: repo.name,
        description: repo.description || 'No description available',
        html_url: repo.html_url,
        topics: repo.topics || [],
        language: repo.language || 'Unknown',
        default_branch: repo.default_branch || 'main',
        readme: '' // Will be populated later
      })))
    );
  }

  getReadmeForRepo(repo: GitHubRepo): Observable<string> {
    const readmeUrl = `${this.rawContentUrl}/${this.username}/${repo.name}/${repo.default_branch}/README.md`;
    return this.http.get(readmeUrl, { responseType: 'text' }).pipe(
      catchError(() => of('No README available'))
    );
  }

  getAllReposWithReadme(): Observable<GitHubRepo[]> {
    return this.getRepositories().pipe(
      switchMap(repos => {
        const readmeRequests = repos.map(repo => 
          this.getReadmeForRepo(repo).pipe(
            map(readme => ({
              ...repo,
              readme
            }))
          )
        );
        return forkJoin(readmeRequests);
      })
    );
  }
} 