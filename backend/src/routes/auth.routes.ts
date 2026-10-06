import { Router, Response } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware, RequestConUsuario } from '../middlewares/auth.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { LoginDto } from '../dtos/auth.dto';

const router = Router();

// Rutas públicas — no necesitan token

router.post('/login', validarDto(LoginDto), authController.login);

// Ruta protegida de prueba — necesita token
router.get('/me', authMiddleware, (req: RequestConUsuario, res: Response) => {
  res.json({ usuario: req.usuario });
});

export default router;
