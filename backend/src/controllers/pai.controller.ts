import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { paiService } from '../services/pai.service';

// Sin try/catch: los errores llegan al manejador global (middlewares/errores.middleware.ts)
export const paiController = {

  async getByPersona(req: RequestConUsuario, res: Response) {
    res.json(await paiService.getByPersona(Number(req.params.personaId)));
  },

  async getById(req: RequestConUsuario, res: Response) {
    res.json(await paiService.getById(Number(req.params.id)));
  },

  async crear(req: RequestConUsuario, res: Response) {
    res.status(201).json(
      await paiService.crear(Number(req.params.personaId), req.body, req.usuario!.id)
    );
  },

  async actualizar(req: RequestConUsuario, res: Response) {
    res.json(await paiService.actualizar(Number(req.params.id), req.body));
  },

  async cambiarEstado(req: RequestConUsuario, res: Response) {
    res.json(await paiService.cambiarEstado(Number(req.params.id), req.body));
  }
};
