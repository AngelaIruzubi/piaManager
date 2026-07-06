import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { paiService } from '../services/pai.service';

export const paiController = {

  async getByPersona(req: RequestConUsuario, res: Response) {
    try {
      const result = await paiService.getByPersona(Number(req.params.personaId));
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async getById(req: RequestConUsuario, res: Response) {
    try {
      const result = await paiService.getById(Number(req.params.id));
      res.json(result);
    } catch (e: any) {
      res.status(404).json({ mensaje: e.message });
    }
  },

  async crear(req: RequestConUsuario, res: Response) {
    try {
      const result = await paiService.crear(
        Number(req.params.personaId),
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
      const result = await paiService.actualizar(Number(req.params.id), req.body);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async cambiarEstado(req: RequestConUsuario, res: Response) {
    try {
      const result = await paiService.cambiarEstado(Number(req.params.id), req.body);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  }
};