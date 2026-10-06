import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

// Sin try/catch: los errores llegan al manejador global (middlewares/errores.middleware.ts)
export const authController = {

  async login(req: Request, res: Response) {
    res.json(await authService.login(req.body));
  }
};
