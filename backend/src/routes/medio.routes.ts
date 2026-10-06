import { Router } from 'express';
import { medioController } from '../controllers/medio.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { CrearMedioDto, ActualizarMedioDto } from '../dtos/medio.dto';

const router = Router({ mergeParams: true });

router.get('/', authMiddleware, medioController.getByObjetivo);
router.post('/', authMiddleware, validarDto(CrearMedioDto), medioController.crear);
router.put('/:id', authMiddleware, validarDto(ActualizarMedioDto), medioController.actualizar);
router.delete('/:id', authMiddleware, medioController.eliminar);

export default router;
