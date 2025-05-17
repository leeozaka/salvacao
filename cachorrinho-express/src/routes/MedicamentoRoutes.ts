import { Router } from 'express';
import { Container } from '../container';

const router = Router();
const auth = Container.getAuthMiddleware();
const medicamentoController = Container.getMedicamentoController();

router.use(auth);

router.post('/', medicamentoController.create);
router.get('/', medicamentoController.findAll);
router.get('/:id', medicamentoController.findOne);
router.put('/:id', medicamentoController.update);
router.delete('/:id', medicamentoController.delete);

export default router;