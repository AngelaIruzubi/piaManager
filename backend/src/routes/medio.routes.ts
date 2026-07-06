import { Router } from 'express';
import { medioController } from '../controllers/medio.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/', authMiddleware, medioController.getByObjetivo);
router.post('/', authMiddleware, medioController.crear);
router.put('/:id', authMiddleware, medioController.actualizar);
router.delete('/:id', authMiddleware, medioController.eliminar);

export default router;