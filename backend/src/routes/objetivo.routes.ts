import { Router } from 'express';
import { objetivoController } from '../controllers/objetivo.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

// Por área
router.get('/', authMiddleware, objetivoController.getByArea);
router.post('/', authMiddleware, objetivoController.crear);

// Por objetivo
router.get('/:id', authMiddleware, objetivoController.getById);
router.put('/:id', authMiddleware, objetivoController.actualizar);
router.patch('/:id/estado', authMiddleware, objetivoController.cambiarEstado);
router.delete('/:id', authMiddleware, objetivoController.eliminar);

export default router;