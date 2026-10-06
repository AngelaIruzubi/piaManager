import { Router } from 'express';
import { personasController } from '../controllers/personas.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { soloCoordinador } from '../middlewares/roles.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { CrearPersonaDto, ActualizarPersonaDto } from '../dtos/personas.dto';

const router = Router();

// Ambos roles
router.get('/', authMiddleware, personasController.getAll);
router.get('/:id', authMiddleware, personasController.getById);
router.put('/:id', authMiddleware, soloCoordinador, validarDto(ActualizarPersonaDto), personasController.actualizar);

// Solo coordinador
router.post('/', authMiddleware, soloCoordinador, validarDto(CrearPersonaDto), personasController.crear);
router.patch('/:id/baja', authMiddleware, soloCoordinador, personasController.darDeBaja);

export default router;
