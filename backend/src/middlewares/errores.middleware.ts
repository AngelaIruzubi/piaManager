import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';

// Rutas que no existen
export const rutaNoEncontrada = (req: Request, res: Response) => {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// Manejador global: Express 5 envía aquí cualquier error lanzado en un middleware o controller (también async).
// Tiene que tener 4 parámetros para que Express lo reconozca como manejador de errores.
export const manejadorErrores = (err: any, req: Request, res: Response, _next: NextFunction) => {
  // Errores esperados: los lanzan los servicios con su código
  if (err instanceof HttpError) {
    return res.status(err.status).json({ mensaje: err.message });
  }

  // Errores de PostgreSQL que no son fallos del servidor (TypeORM los envuelve en driverError)
  const codigoPostgres = err?.driverError?.code ?? err?.code;
  if (codigoPostgres === '23503') { // clave foránea: se referencia algo que no existe
    return res.status(404).json({ mensaje: 'El elemento relacionado no existe' });
  }
  if (codigoPostgres === '23505') { // valor único duplicado
    return res.status(409).json({ mensaje: 'Ya existe un registro con esos datos' });
  }

  // JSON mal formado en el body (lo detecta express.json)
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }

  // Inesperados (base de datos caída, bugs...): se registran, pero al cliente no se le dan detalles
  console.error(`❌ Error en ${req.method} ${req.originalUrl}:`, err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
};
