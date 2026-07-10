import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Es un middleware de Angular que intercepta las solicitudes HTTP y agrega un token de autenticación si está disponible. Esto permite que las solicitudes a la API incluyan el token en el encabezado de autorización, lo que es útil para la autenticación basada en JWT (JSON Web Token).
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const reqConToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(reqConToken);
  }

  return next(req);
};

//middleware == puente entre la solicitud y la respuesta, que permite modificar o inspeccionar las solicitudes y respuestas HTTP. En este caso, el middleware jwtInterceptor se encarga de agregar el token de autenticación a las solicitudes HTTP si está disponible.