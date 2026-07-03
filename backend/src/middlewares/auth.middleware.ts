import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface RequestConUsuario extends Request {
  usuario?: { id: number; email: string; rol: string };
}

export const authMiddleware = (
  req: RequestConUsuario,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.usuario = payload;
    next();
  } catch {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};