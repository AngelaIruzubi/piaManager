import { Router } from 'express';
import { paiController } from '../controllers/pai.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { soloCoordinador } from '../middlewares/roles.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { accesoPersona, personaPorId, personaDePai } from '../middlewares/acceso.middleware';
import { CrearPaiDto, ActualizarPaiDto, CambiarEstadoPaiDto } from '../dtos/pai.dto';

const router = Router({ mergeParams: true });

// Ambos roles (un educador solo con sus personas)
router.get('/', authMiddleware, accesoPersona(personaPorId('personaId')), paiController.getByPersona);
router.get('/:id', authMiddleware, accesoPersona(personaDePai('id')), paiController.getById);
router.put('/:id', authMiddleware, accesoPersona(personaDePai('id')), validarDto(ActualizarPaiDto), paiController.actualizar);

// Solo coordinador
router.post('/', authMiddleware, soloCoordinador, validarDto(CrearPaiDto), paiController.crear);
router.patch('/:id/estado', authMiddleware, soloCoordinador, validarDto(CambiarEstadoPaiDto), paiController.cambiarEstado);

export default router;
