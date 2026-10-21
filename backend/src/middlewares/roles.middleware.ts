import { Response, NextFunction } from 'express';
import { RequestConUsuario } from './auth.middleware';

export const soloCoordinador = (
  req: RequestConUsuario,
  res: Response,
  next: NextFunction
) => {
  if (req.usuario?.rol !== 'coordinador') {
    return res.status(403).json({ mensaje: 'Acceso denegado: solo coordinadores' });
  }
  next();
};
