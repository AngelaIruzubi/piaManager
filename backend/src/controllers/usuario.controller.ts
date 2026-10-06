import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { usuarioService } from '../services/usuario.service';

// Sin try/catch: los errores llegan al manejador global (middlewares/errores.middleware.ts)
export const usuarioController = {

  async getAll(req: RequestConUsuario, res: Response) {
    res.json(await usuarioService.getAll());
  },

  async getEducadores(req: RequestConUsuario, res: Response) {
    res.json(await usuarioService.getEducadores());
  },

  async getById(req: RequestConUsuario, res: Response) {
    res.json(await usuarioService.getById(Number(req.params.id)));
  },

  async crear(req: RequestConUsuario, res: Response) {
    res.status(201).json(await usuarioService.crear(req.body));
  },

  async actualizar(req: RequestConUsuario, res: Response) {
    res.json(await usuarioService.actualizar(Number(req.params.id), req.body));
  },

  async darDeBaja(req: RequestConUsuario, res: Response) {
    res.json(await usuarioService.darDeBaja(Number(req.params.id), req.usuario!.id));
  }
};
