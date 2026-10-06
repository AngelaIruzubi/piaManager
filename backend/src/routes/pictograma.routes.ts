import { Router } from 'express';
import { pictogramaController } from '../controllers/pictograma.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validarDto } from '../middlewares/validar.middleware';
import { accesoPersona, personaDeObjetivo, personaDePictograma } from '../middlewares/acceso.middleware';
import { GuardarPictogramaDto } from '../dtos/pictograma.dto';

const router = Router({ mergeParams: true });

const accesoObjetivo = accesoPersona(personaDeObjetivo('objetivoId'));

// La búsqueda en ARASAAC no toca datos de ninguna persona
router.get('/buscar', authMiddleware, pictogramaController.buscar);
router.get('/:objetivoId/pictogramas/sugerencias', authMiddleware, accesoObjetivo, pictogramaController.sugerencias);
router.get('/:objetivoId/pictogramas', authMiddleware, accesoObjetivo, pictogramaController.getByObjetivo);
router.post('/:objetivoId/pictogramas', authMiddleware, accesoObjetivo, validarDto(GuardarPictogramaDto), pictogramaController.guardar);
router.delete('/:id', authMiddleware, accesoPersona(personaDePictograma('id')), pictogramaController.eliminar);

export default router;
