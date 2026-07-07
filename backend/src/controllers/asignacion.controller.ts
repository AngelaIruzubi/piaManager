import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { asignacionService } from '../services/asignacion.service';

export const asignacionController = {

  async getByPersona(req: RequestConUsuario, res: Response) {
    try {
      const result = await asignacionService.getByPersona(
        Number(req.params.personaId)
      );
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async asignar(req: RequestConUsuario, res: Response) {
    try {
      const result = await asignacionService.asignar(
        Number(req.params.personaId),
        req.body
      );
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async finalizar(req: RequestConUsuario, res: Response) {
    try {
      const result = await asignacionService.finalizar(Number(req.params.id));
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  }
};