import { Router } from 'express';
import { pictogramaController } from '../controllers/pictograma.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/buscar', authMiddleware, pictogramaController.buscar);
router.get('/:objetivoId/pictogramas/sugerencias', authMiddleware, pictogramaController.sugerencias);
router.get('/:objetivoId/pictogramas', authMiddleware, pictogramaController.getByObjetivo);
router.post('/:objetivoId/pictogramas', authMiddleware, pictogramaController.guardar);
router.delete('/:id', authMiddleware, pictogramaController.eliminar);

export default router;