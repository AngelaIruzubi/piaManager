import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { personasService } from '../services/personas.service';

// Sin try/catch: los errores llegan al manejador global (middlewares/errores.middleware.ts)
export const personasController = {

  async getAll(req: RequestConUsuario, res: Response) {
    res.json(await personasService.getAll(req.usuario!.id, req.usuario!.rol));
  },

  async getById(req: RequestConUsuario, res: Response) {
    res.json(await personasService.getById(Number(req.params.id)));
  },

  async crear(req: RequestConUsuario, res: Response) {
    res.status(201).json(await personasService.crear(req.body));
  },

  async actualizar(req: RequestConUsuario, res: Response) {
    res.json(await personasService.actualizar(Number(req.params.id), req.body));
  },

  async darDeBaja(req: RequestConUsuario, res: Response) {
    res.json(await personasService.darDeBaja(Number(req.params.id)));
  }
};
