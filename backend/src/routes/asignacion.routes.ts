import { Router } from 'express';
import { asignacionController } from '../controllers/asignacion.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { soloCoordinador } from '../middlewares/roles.middleware';

const router = Router({ mergeParams: true });

// Historial de asignaciones
router.get('/', authMiddleware, soloCoordinador, asignacionController.getByPersona);

// Asignar educador
router.post('/', authMiddleware, soloCoordinador, asignacionController.asignar);

// Finalizar asignación
router.patch('/:id/finalizar', authMiddleware, soloCoordinador, asignacionController.finalizar);

export default router;