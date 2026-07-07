import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { seguimientoService } from '../services/seguimiento.service';

export const seguimientoController = {

  async getByObjetivo(req: RequestConUsuario, res: Response) {
    try {
      const result = await seguimientoService.getByObjetivo(
        Number(req.params.objetivoId)
      );
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async crear(req: RequestConUsuario, res: Response) {
    try {
      const result = await seguimientoService.crear(
        Number(req.params.objetivoId),
        req.body,
        req.usuario!.id
      );
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },
  async actualizar(req: RequestConUsuario, res: Response) {
  try {
    const result = await seguimientoService.actualizar(
      Number(req.params.id),
      req.body
    );
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ mensaje: e.message });
  }
}
};