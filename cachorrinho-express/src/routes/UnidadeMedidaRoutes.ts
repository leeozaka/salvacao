import { Router } from 'express';
import { Container } from '../container';

const router = Router();
const auth = Container.getAuthMiddleware();
const unidadeMedidaController = Container.getUnidadeMedidaController();

// Aplicar middleware de autenticação em todas as rotas
router.use(auth);

// Rotas para UnidadeMedida
router.post('/', unidadeMedidaController.create);
router.get('/', unidadeMedidaController.findAll);
router.get('/:id', unidadeMedidaController.findOne);
router.put('/:id', unidadeMedidaController.update);
router.delete('/:id', unidadeMedidaController.delete);

export default router;
