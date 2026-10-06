import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { seguimientoService } from '../services/seguimiento.service';

// Sin try/catch: los errores llegan al manejador global (middlewares/errores.middleware.ts)
export const seguimientoController = {

  async getByObjetivo(req: RequestConUsuario, res: Response) {
    res.json(await seguimientoService.getByObjetivo(Number(req.params.objetivoId)));
  },

  async crear(req: RequestConUsuario, res: Response) {
    res.status(201).json(
      await seguimientoService.crear(Number(req.params.objetivoId), req.body, req.usuario!.id)
    );
  },

  async actualizar(req: RequestConUsuario, res: Response) {
    res.json(await seguimientoService.actualizar(Number(req.params.id), req.body));
  }
};
