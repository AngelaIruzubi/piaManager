// Errores de la aplicación: cada uno lleva su código HTTP.
// El manejador global (middlewares/errores.middleware.ts) los convierte en la respuesta.

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = new.target.name;
  }
}

// 400: los datos enviados no son válidos
export class BadRequestError extends HttpError {
  constructor(message: string) { super(400, message); }
}

// 401: no se sabe quién eres (login incorrecto)
export class UnauthorizedError extends HttpError {
  constructor(message: string) { super(401, message); }
}

// 403: se sabe quién eres, pero no puedes hacer esto
export class ForbiddenError extends HttpError {
  constructor(message: string) { super(403, message); }
}

// 404: lo que buscas no existe
export class NotFoundError extends HttpError {
  constructor(message: string) { super(404, message); }
}

// 409: la operación choca con el estado actual (duplicados, reglas de negocio)
export class ConflictError extends HttpError {
  constructor(message: string) { super(409, message); }
}

// 502: falla un servicio externo del que dependemos (ARASAAC)
export class BadGatewayError extends HttpError {
  constructor(message: string) { super(502, message); }
}
