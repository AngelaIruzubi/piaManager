import { Router } from 'express';
import { catalogoController } from '../controllers/catalogo.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Solo lectura: los catálogos no contienen datos de personas, cualquier usuario autenticado puede consultarlos
router.get('/:tipo', authMiddleware, catalogoController.getByTipo);

export default router;
