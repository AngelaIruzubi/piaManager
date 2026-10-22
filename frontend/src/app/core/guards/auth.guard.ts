import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  // Si había un token pero ya no vale, la sesión ha caducado: se limpia y se avisa en el login
  const caducada = authService.getToken() !== null;
  authService.logout();
  return router.createUrlTree(['/login'], caducada ? { queryParams: { sesion: 'caducada' } } : {});
};
