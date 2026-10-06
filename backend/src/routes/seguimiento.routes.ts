import { Router } from 'express';
import { seguimientoController } from '../controllers/seguimiento.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { accesoPersona, personaDeObjetivo, personaDeSeguimiento } from '../middlewares/acceso.middleware';
import { CrearSeguimientoDto, ActualizarSeguimientoDto } from '../dtos/seguimiento.dto';

const router = Router({ mergeParams: true });

const accesoObjetivo = accesoPersona(personaDeObjetivo('objetivoId'));

router.get('/', authMiddleware, accesoObjetivo, seguimientoController.getByObjetivo);
router.post('/', authMiddleware, accesoObjetivo, validarDto(CrearSeguimientoDto), seguimientoController.crear);
router.put('/:id', authMiddleware, accesoPersona(personaDeSeguimiento('id')), validarDto(ActualizarSeguimientoDto), seguimientoController.actualizar);

export default router;
