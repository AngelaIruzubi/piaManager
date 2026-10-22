import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Es un middleware de Angular que intercepta las solicitudes HTTP y agrega un token de autenticación si está disponible. Esto permite que las solicitudes a la API incluyan el token en el encabezado de autorización, lo que es útil para la autenticación basada en JWT (JSON Web Token).
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const peticion = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((error: unknown) => {
      // 401 con token: el backend ya no lo acepta (caducado o inválido). Se cierra la sesión y se vuelve
      // al login. En el propio login un 401 significa "credenciales incorrectas" y lo gestiona el formulario
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        token &&
        !req.url.endsWith('/auth/login')
      ) {
        authService.logout();
        router.navigate(['/login'], { queryParams: { sesion: 'caducada' } });
      }
      return throwError(() => error);
    }),
  );
};

//middleware == puente entre la solicitud y la respuesta, que permite modificar o inspeccionar las solicitudes y respuestas HTTP. En este caso, el middleware jwtInterceptor se encarga de agregar el token de autenticación a las solicitudes HTTP si está disponible.
