import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export const authController = {

  async login(req: Request, res: Response) {
    try {
      const resultado = await authService.login(req.body);
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(401).json({ mensaje: error.message });
    }
  }
};