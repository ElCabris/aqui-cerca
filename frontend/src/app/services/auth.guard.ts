import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Limpia sesión si el token es inválido/expirado y redirige a login
    authService.logout();
    router.navigate(['/login']);
    return false;
  }
};
