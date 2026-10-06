import { Router } from 'express';
import { seguimientoController } from '../controllers/seguimiento.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { CrearSeguimientoDto, ActualizarSeguimientoDto } from '../dtos/seguimiento.dto';

const router = Router({ mergeParams: true });

router.get('/', authMiddleware, seguimientoController.getByObjetivo);
router.post('/', authMiddleware, validarDto(CrearSeguimientoDto), seguimientoController.crear);
router.put('/:id', authMiddleware, validarDto(ActualizarSeguimientoDto), seguimientoController.actualizar);

export default router;
