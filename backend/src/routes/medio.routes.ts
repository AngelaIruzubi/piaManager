import { Router } from 'express';
import { medioController } from '../controllers/medio.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { accesoPersona, personaDeObjetivo, personaDeMedio } from '../middlewares/acceso.middleware';
import { CrearMedioDto, ActualizarMedioDto } from '../dtos/medio.dto';

const router = Router({ mergeParams: true });

const accesoObjetivo = accesoPersona(personaDeObjetivo('objetivoId'));
const accesoMedio = accesoPersona(personaDeMedio('id'));

router.get('/', authMiddleware, accesoObjetivo, medioController.getByObjetivo);
router.post('/', authMiddleware, accesoObjetivo, validarDto(CrearMedioDto), medioController.crear);
router.put('/:id', authMiddleware, accesoMedio, validarDto(ActualizarMedioDto), medioController.actualizar);
router.delete('/:id', authMiddleware, accesoMedio, medioController.eliminar);

export default router;
