import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { pictogramaService } from '../services/pictograma.service';
import { BadRequestError } from '../errors';

// Sin try/catch: los errores llegan al manejador global (middlewares/errores.middleware.ts)
export const pictogramaController = {

  async buscar(req: RequestConUsuario, res: Response) {
    const { keyword } = req.query;
    if (!keyword) throw new BadRequestError('Keyword requerida');
    res.json(await pictogramaService.buscar(keyword as string));
  },

  async sugerencias(req: RequestConUsuario, res: Response) {
    res.json(await pictogramaService.sugerirPorObjetivo(Number(req.params.objetivoId)));
  },

  async getByObjetivo(req: RequestConUsuario, res: Response) {
    res.json(await pictogramaService.getByObjetivo(Number(req.params.objetivoId)));
  },

  async guardar(req: RequestConUsuario, res: Response) {
    res.status(201).json(
      await pictogramaService.guardar(Number(req.params.objetivoId), req.body.arasaac_id, req.body.keyword)
    );
  },

  async eliminar(req: RequestConUsuario, res: Response) {
    res.json(await pictogramaService.eliminar(Number(req.params.id)));
  }
};
