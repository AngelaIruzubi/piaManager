import { Router } from 'express';
import { pictogramaController } from '../controllers/pictograma.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { GuardarPictogramaDto } from '../dtos/pictograma.dto';

const router = Router({ mergeParams: true });

router.get('/buscar', authMiddleware, pictogramaController.buscar);
router.get('/:objetivoId/pictogramas/sugerencias', authMiddleware, pictogramaController.sugerencias);
router.get('/:objetivoId/pictogramas', authMiddleware, pictogramaController.getByObjetivo);
router.post('/:objetivoId/pictogramas', authMiddleware, validarDto(GuardarPictogramaDto), pictogramaController.guardar);
router.delete('/:id', authMiddleware, pictogramaController.eliminar);

export default router;
