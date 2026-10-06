import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { asignacionService } from '../services/asignacion.service';

// Sin try/catch: los errores llegan al manejador global (middlewares/errores.middleware.ts)
export const asignacionController = {

  async getByPersona(req: RequestConUsuario, res: Response) {
    res.json(await asignacionService.getByPersona(Number(req.params.personaId)));
  },

  async asignar(req: RequestConUsuario, res: Response) {
    res.status(201).json(await asignacionService.asignar(Number(req.params.personaId), req.body));
  },

  async finalizar(req: RequestConUsuario, res: Response) {
    res.json(await asignacionService.finalizar(Number(req.params.id)));
  }
};
