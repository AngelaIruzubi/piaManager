import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { soloCoordinador } from '../middlewares/roles.middleware';

const router = Router();

// Todo solo para coordinadores
router.get('/', authMiddleware, soloCoordinador, usuarioController.getAll);
router.get('/:id', authMiddleware, soloCoordinador, usuarioController.getById);
router.post('/', authMiddleware, soloCoordinador, usuarioController.crear);
router.put('/:id', authMiddleware, soloCoordinador, usuarioController.actualizar);
router.patch('/:id/baja', authMiddleware, soloCoordinador, usuarioController.darDeBaja);

export default router;