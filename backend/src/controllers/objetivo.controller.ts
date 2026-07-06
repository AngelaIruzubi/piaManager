import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { objetivoService } from '../services/objetivo.service';

export const objetivoController = {

  async getByArea(req: RequestConUsuario, res: Response) {
    try {
      const result = await objetivoService.getByArea(Number(req.params.areaId));
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async getById(req: RequestConUsuario, res: Response) {
    try {
      const result = await objetivoService.getById(Number(req.params.id));
      res.json(result);
    } catch (e: any) {
      res.status(404).json({ mensaje: e.message });
    }
  },

  async crear(req: RequestConUsuario, res: Response) {
    try {
      const result = await objetivoService.crear(
        Number(req.params.areaId),
        req.body
      );
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async actualizar(req: RequestConUsuario, res: Response) {
    try {
      const result = await objetivoService.actualizar(
        Number(req.params.id),
        req.body
      );
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async cambiarEstado(req: RequestConUsuario, res: Response) {
    try {
      const result = await objetivoService.cambiarEstado(
        Number(req.params.id),
        req.body
      );
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async eliminar(req: RequestConUsuario, res: Response) {
    try {
      const result = await objetivoService.eliminar(Number(req.params.id));
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  }
};