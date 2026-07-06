import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { personasService } from '../services/personas.service';

export const personasController = {

  async getAll(req: RequestConUsuario, res: Response) {
    try {
      const result = await personasService.getAll(
        req.usuario!.id,
        req.usuario!.rol
      );
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async getById(req: RequestConUsuario, res: Response) {
    try {
      const result = await personasService.getById(Number(req.params.id));
      res.json(result);
    } catch (e: any) {
      res.status(404).json({ mensaje: e.message });
    }
  },

  async crear(req: RequestConUsuario, res: Response) {
    try {
      const result = await personasService.crear(req.body);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async actualizar(req: RequestConUsuario, res: Response) {
    try {
      const result = await personasService.actualizar(
        Number(req.params.id),
        req.body
      );
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async darDeBaja(req: RequestConUsuario, res: Response) {
    try {
      const result = await personasService.darDeBaja(Number(req.params.id));
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  }
};