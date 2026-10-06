import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { medioService } from '../services/medio.service';

// Sin try/catch: los errores llegan al manejador global (middlewares/errores.middleware.ts)
export const medioController = {

  async getByObjetivo(req: RequestConUsuario, res: Response) {
    res.json(await medioService.getByObjetivo(Number(req.params.objetivoId)));
  },

  async crear(req: RequestConUsuario, res: Response) {
    res.status(201).json(await medioService.crear(Number(req.params.objetivoId), req.body));
  },

  async actualizar(req: RequestConUsuario, res: Response) {
    res.json(await medioService.actualizar(Number(req.params.id), req.body));
  },

  async eliminar(req: RequestConUsuario, res: Response) {
    res.json(await medioService.eliminar(Number(req.params.id)));
  }
};
