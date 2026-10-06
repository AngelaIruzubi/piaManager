import { Router } from 'express';
import { paiController } from '../controllers/pai.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { soloCoordinador } from '../middlewares/roles.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { CrearPaiDto, ActualizarPaiDto, CambiarEstadoPaiDto } from '../dtos/pai.dto';

const router = Router({ mergeParams: true });

// Ambos roles
router.get('/', authMiddleware, paiController.getByPersona);
router.get('/:id', authMiddleware, paiController.getById);
router.put('/:id', authMiddleware, validarDto(ActualizarPaiDto), paiController.actualizar);

// Solo coordinador
router.post('/', authMiddleware, soloCoordinador, validarDto(CrearPaiDto), paiController.crear);
router.patch('/:id/estado', authMiddleware, soloCoordinador, validarDto(CambiarEstadoPaiDto), paiController.cambiarEstado);

export default router;
