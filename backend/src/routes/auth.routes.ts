import { Router, Response } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware, RequestConUsuario } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas — no necesitan token

router.post('/login', authController.login);

// Ruta protegida de prueba — necesita token
router.get('/me', authMiddleware, (req: RequestConUsuario, res: Response) => {
  res.json({ usuario: req.usuario });
});

export default router;