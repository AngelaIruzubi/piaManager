import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { catalogoService } from '../services/catalogo.service';

// Sin try/catch: los errores llegan al manejador global (middlewares/errores.middleware.ts)
export const catalogoController = {

  async getByTipo(req: RequestConUsuario, res: Response) {
    res.json(await catalogoService.getByTipo(String(req.params.tipo)));
  }
};
