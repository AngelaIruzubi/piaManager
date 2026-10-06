import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { soloCoordinador } from '../middlewares/roles.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { CrearUsuarioDto, ActualizarUsuarioDto } from '../dtos/usuario.dto';

const router = Router();

// Accesible para cualquier usuario autenticado (selector de educador en personas)
router.get('/educadores', authMiddleware, usuarioController.getEducadores);

// Todo solo para coordinadores
router.get('/', authMiddleware, soloCoordinador, usuarioController.getAll);
router.get('/:id', authMiddleware, soloCoordinador, usuarioController.getById);
router.post('/', authMiddleware, soloCoordinador, validarDto(CrearUsuarioDto), usuarioController.crear);
router.put('/:id', authMiddleware, soloCoordinador, validarDto(ActualizarUsuarioDto), usuarioController.actualizar);
router.patch('/:id/baja', authMiddleware, soloCoordinador, usuarioController.darDeBaja);

export default router;
