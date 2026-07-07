import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { usuarioService } from '../services/usuario.service';

export const usuarioController = {

  async getAll(req: RequestConUsuario, res: Response) {
    try {
      const result = await usuarioService.getAll();
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  },

  async getById(req: RequestConUsuario, res: Response) {
    try {
      const result = await usuarioService.getById(Number(req.params.id));
      res.json(result);
    } catch (e: any) {
      res.status(404).json({ mensaje: e.message });
    }
  },
  async crear(req: RequestConUsuario, res: Response) {
  try {
    const result = await usuarioService.crear(req.body);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({ mensaje: e.message });
  }
},

  async actualizar(req: RequestConUsuario, res: Response) {
    try {
      const result = await usuarioService.actualizar(
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
      const result = await usuarioService.darDeBaja(Number(req.params.id));
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ mensaje: e.message });
    }
  }
};