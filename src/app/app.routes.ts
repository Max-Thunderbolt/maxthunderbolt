import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'cv',
    loadComponent: () => import('./cv/cv.component').then((m) => m.CvComponent),
  },
  {
    path: 'chatbot',
    loadComponent: () =>
      import('./chatbot/chatbot.component').then((m) => m.ChatbotComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
