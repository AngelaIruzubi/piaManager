import { Router } from 'express';
import { paiController } from '../controllers/pai.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { soloCoordinador } from '../middlewares/roles.middleware';

const router = Router({ mergeParams: true });

// Ambos roles
router.get('/', authMiddleware, paiController.getByPersona);
router.get('/:id', authMiddleware, paiController.getById);
router.put('/:id', authMiddleware, paiController.actualizar);

// Solo coordinador
router.post('/', authMiddleware, soloCoordinador, paiController.crear);
router.patch('/:id/estado', authMiddleware, soloCoordinador, paiController.cambiarEstado);

export default router;