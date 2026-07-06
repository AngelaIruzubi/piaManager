import { Router } from 'express';
import { personasController } from '../controllers/personas.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { soloCoordinador } from '../middlewares/roles.middleware';

const router = Router();

// Ambos roles
router.get('/', authMiddleware, personasController.getAll);
router.get('/:id', authMiddleware, personasController.getById);
router.put('/:id', authMiddleware, personasController.actualizar);

// Solo coordinador
router.post('/', authMiddleware, soloCoordinador, personasController.crear);
router.patch('/:id/baja', authMiddleware, soloCoordinador, personasController.darDeBaja);

export default router;