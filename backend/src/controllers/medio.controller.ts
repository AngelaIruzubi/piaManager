import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { medioService } from '../services/medio.service';

export const medioController = {

  async getByObjetivo(req: RequestConUsuario, res: Response) {
    try {
      const result = await medioService.getByObjetivo(Number(req.params.objetivoId));
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async crear(req: RequestConUsuario, res: Response) {
    try {
      const result = await medioService.crear(
        Number(req.params.objetivoId),
        req.body
      );
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async actualizar(req: RequestConUsuario, res: Response) {
    try {
      const result = await medioService.actualizar(
        Number(req.params.id),
        req.body
      );
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async eliminar(req: RequestConUsuario, res: Response) {
    try {
      const result = await medioService.eliminar(Number(req.params.id));
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  }
};