import { Router } from 'express';
import { seguimientoController } from '../controllers/seguimiento.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/', authMiddleware, seguimientoController.getByObjetivo);
router.post('/', authMiddleware, seguimientoController.crear);
router.put('/:id', authMiddleware, seguimientoController.actualizar);

export default router;