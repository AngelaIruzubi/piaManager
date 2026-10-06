import { Router } from 'express';
import { objetivoController } from '../controllers/objetivo.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { accesoPersona, personaDeArea, personaDeObjetivo } from '../middlewares/acceso.middleware';
import { CrearObjetivoDto, ActualizarObjetivoDto, CambiarEstadoObjetivoDto } from '../dtos/objetivo.dto';

const router = Router({ mergeParams: true });

const accesoArea = accesoPersona(personaDeArea('areaId'));
const accesoObjetivo = accesoPersona(personaDeObjetivo('id'));

// Por área
router.get('/', authMiddleware, accesoArea, objetivoController.getByArea);
router.post('/', authMiddleware, accesoArea, validarDto(CrearObjetivoDto), objetivoController.crear);

// Por objetivo
router.get('/:id', authMiddleware, accesoObjetivo, objetivoController.getById);
router.put('/:id', authMiddleware, accesoObjetivo, validarDto(ActualizarObjetivoDto), objetivoController.actualizar);
router.patch('/:id/estado', authMiddleware, accesoObjetivo, validarDto(CambiarEstadoObjetivoDto), objetivoController.cambiarEstado);
router.delete('/:id', authMiddleware, accesoObjetivo, objetivoController.eliminar);

export default router;
