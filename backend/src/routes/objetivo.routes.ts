import { Router } from 'express';
import { objetivoController } from '../controllers/objetivo.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { CrearObjetivoDto, ActualizarObjetivoDto, CambiarEstadoObjetivoDto } from '../dtos/objetivo.dto';

const router = Router({ mergeParams: true });

// Por área
router.get('/', authMiddleware, objetivoController.getByArea);
router.post('/', authMiddleware, validarDto(CrearObjetivoDto), objetivoController.crear);

// Por objetivo
router.get('/:id', authMiddleware, objetivoController.getById);
router.put('/:id', authMiddleware, validarDto(ActualizarObjetivoDto), objetivoController.actualizar);
router.patch('/:id/estado', authMiddleware, validarDto(CambiarEstadoObjetivoDto), objetivoController.cambiarEstado);
router.delete('/:id', authMiddleware, objetivoController.eliminar);

export default router;
