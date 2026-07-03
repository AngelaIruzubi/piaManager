//Es el semaforo envia codigos http de respuesta y los datos que se le piden al servicio
import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export const authController = {

  async register(req: Request, res: Response) {
    try {
      const resultado = await authService.register(req.body);
      res.status(201).json(resultado);
    } catch (error: any) {
      res.status(400).json({ mensaje: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const resultado = await authService.login(req.body);
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(401).json({ mensaje: error.message });
    }
  }

};