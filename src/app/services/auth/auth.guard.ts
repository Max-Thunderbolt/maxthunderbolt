import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.authState$.pipe(
    take(1),
    map(authState => {
      // Return true if authenticated, redirect to login otherwise
      if (authState.isAuthenticated) {
        return true;
      }

      // If not authenticated and not still loading, redirect to login
      if (!authState.isLoading) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      // Still loading auth state, return false for now
      return false;
    })
  );
}; 