import { Router } from 'express';
import { Container } from '../container';

const routes = Router();
const userController = Container.getPessoaController();
const auth = Container.getAuthMiddleware();

routes.post('/', userController.create);
routes.get('/all', auth, userController.findAll);
routes.get('/:id', auth, userController.findOne);
routes.get('/', auth, userController.findOne);
routes.delete('/:id', auth, userController.delete);
routes.put('/:id', auth, userController.update);

export default routes;
