import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { pictogramaService } from '../services/pictograma.service';

export const pictogramaController = {

  async buscar(req: RequestConUsuario, res: Response) {
    try {
      const { keyword } = req.query;
      if (!keyword) return res.status(400).json({ mensaje: 'Keyword requerida' });
      const result = await pictogramaService.buscar(keyword as string);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async sugerencias(req: RequestConUsuario, res: Response) {
    try {
      const result = await pictogramaService.sugerirPorObjetivo(Number(req.params.objetivoId));
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async getByObjetivo(req: RequestConUsuario, res: Response) {
    try {
      const result = await pictogramaService.getByObjetivo(Number(req.params.objetivoId));
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async guardar(req: RequestConUsuario, res: Response) {
    try {
      const result = await pictogramaService.guardar(
        Number(req.params.objetivoId),
        req.body.arasaac_id,
        req.body.keyword
      );
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async eliminar(req: RequestConUsuario, res: Response) {
    try {
      const result = await pictogramaService.eliminar(Number(req.params.id));
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  }
};