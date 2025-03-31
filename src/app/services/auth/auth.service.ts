import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap, tap, map, catchError } from 'rxjs/operators';

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  Auth, 
  User, 
  UserCredential,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';

import { firebaseServices } from '../../app.config';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  private googleProvider: GoogleAuthProvider;
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  authState$ = this.authStateSubject.asObservable();
  
  constructor(private router: Router) {
    const app = initializeApp(firebaseServices.getConfig());
    this.auth = getAuth(app);
    this.googleProvider = new GoogleAuthProvider();
    
    // Configure Google Auth Provider (optional)
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // Listen to auth state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.authStateSubject.next({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        this.authStateSubject.next({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    });
    
    // Check for redirect result (for mobile)
    this.handleRedirectResult();
  }

  private handleRedirectResult(): void {
    getRedirectResult(this.auth)
      .then(result => {
        if (result?.user) {
          this.authStateSubject.next({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        }
      })
      .catch(error => {
        console.error('Error handling redirect result:', error);
        this.authStateSubject.next({
          ...this.authStateSubject.value,
          isLoading: false,
          error: error.message
        });
      });
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  get isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  login(email: string, password: string): Observable<UserCredential> {
    this.authStateSubject.next({ ...this.authStateSubject.value, isLoading: true, error: null });
    
    return from(signInWithEmailAndPassword(this.auth, email, password))
      .pipe(
        tap(userCredential => {
          this.authStateSubject.next({
            user: userCredential.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        }),
        catchError(error => {
          this.authStateSubject.next({
            ...this.authStateSubject.value,
            isLoading: false,
            error: error.message
          });
          throw error;
        })
      );
  }

  loginWithGoogle(): Observable<UserCredential> {
    this.authStateSubject.next({ ...this.authStateSubject.value, isLoading: true, error: null });
    
    // Use popup for desktop and redirect for mobile
    if (this.isMobileDevice()) {
      // For mobile, we use redirect (popup may be blocked)
      return from(signInWithRedirect(this.auth, this.googleProvider))
        .pipe(
          // Note: This won't actually return user credentials immediately on mobile
          // The handleRedirectResult method will handle the result when the page reloads
          catchError(error => {
            this.authStateSubject.next({
              ...this.authStateSubject.value,
              isLoading: false,
              error: error.message
            });
            throw error;
          })
        );
    } else {
      // For desktop, use popup
      return from(signInWithPopup(this.auth, this.googleProvider))
        .pipe(
          tap(userCredential => {
            this.authStateSubject.next({
              user: userCredential.user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          }),
          catchError(error => {
            this.authStateSubject.next({
              ...this.authStateSubject.value,
              isLoading: false,
              error: error.message
            });
            throw error;
          })
        );
    }
  }

  // Simple mobile detection
  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  register(email: string, password: string): Observable<UserCredential> {
    this.authStateSubject.next({ ...this.authStateSubject.value, isLoading: true, error: null });
    
    return from(createUserWithEmailAndPassword(this.auth, email, password))
      .pipe(
        tap(userCredential => {
          this.authStateSubject.next({
            user: userCredential.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        }),
        catchError(error => {
          this.authStateSubject.next({
            ...this.authStateSubject.value,
            isLoading: false,
            error: error.message
          });
          throw error;
        })
      );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth))
      .pipe(
        tap(() => {
          this.authStateSubject.next({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          this.router.navigate(['/login']);
        })
      );
  }

  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email))
      .pipe(
        catchError(error => {
          this.authStateSubject.next({
            ...this.authStateSubject.value,
            error: error.message
          });
          throw error;
        })
      );
  }
} 