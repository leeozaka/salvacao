import { Router } from 'express';
import { Container } from '../container';

const router = Router();
const auth = Container.getAuthMiddleware();
const tipoProdutoController = Container.getTipoProdutoController();

// Aplicar middleware de autenticação em todas as rotas
router.use(auth);

// Rotas para TipoProduto
router.post('/', tipoProdutoController.create);
router.get('/', tipoProdutoController.findAll);
router.get('/:id', tipoProdutoController.findOne);
router.put('/:id', tipoProdutoController.update);
router.delete('/:id', tipoProdutoController.delete);

export default router;
