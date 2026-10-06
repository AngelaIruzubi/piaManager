import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { objetivoService } from '../services/objetivo.service';

// Sin try/catch: los errores llegan al manejador global (middlewares/errores.middleware.ts)
export const objetivoController = {

  async getByArea(req: RequestConUsuario, res: Response) {
    res.json(await objetivoService.getByArea(Number(req.params.areaId)));
  },

  async getById(req: RequestConUsuario, res: Response) {
    res.json(await objetivoService.getById(Number(req.params.id)));
  },

  async crear(req: RequestConUsuario, res: Response) {
    res.status(201).json(await objetivoService.crear(Number(req.params.areaId), req.body));
  },

  async actualizar(req: RequestConUsuario, res: Response) {
    res.json(await objetivoService.actualizar(Number(req.params.id), req.body));
  },

  async cambiarEstado(req: RequestConUsuario, res: Response) {
    res.json(await objetivoService.cambiarEstado(Number(req.params.id), req.body));
  },

  async eliminar(req: RequestConUsuario, res: Response) {
    res.json(await objetivoService.eliminar(Number(req.params.id)));
  }
};
