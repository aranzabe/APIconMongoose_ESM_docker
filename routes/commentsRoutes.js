import { Router } from 'express';
import controlador from '../controllers/commentsController.js'
export const router = Router();

router.get('/', controlador.comentariosGet);
router.post('/', controlador.addComentario);
router.get('/asignados', controlador.comentariosGetAsignados);
router.get('/asignados/:id', controlador.comentarioGetAsignadoA);

