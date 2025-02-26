import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBNtngJ-70kiyu72k8o5PCbOgF6neBXsKA',
  authDomain: 'maxthunderbolt-71c15.firebaseapp.com',
  projectId: 'maxthunderbolt-71c15',
  storageBucket: 'maxthunderbolt-71c15.firebasestorage.app',
  messagingSenderId: '265660832262',
  appId: '1:265660832262:web:f8543598e5823df97f8187',
  measurementId: 'G-NM77CGZNPL',
};

// Simple service to provide Firebase config
export const firebaseServices = {
  getConfig: () => firebaseConfig,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideClientHydration(),
    provideHttpClient(),
  ],
};
