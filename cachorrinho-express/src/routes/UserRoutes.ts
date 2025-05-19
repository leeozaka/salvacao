import { Router } from 'express';
import { Container } from '../container';

const routes = Router();
const userController = Container.getPessoaUsuarioController();
const auth = Container.getAuthMiddleware();

routes.post('/', userController.create);
//routes.get('/:id', auth, userController.findOne);
routes.get('/', auth, userController.findOne);
routes.delete('/', auth, userController.delete);
routes.put('/', auth, userController.update);
routes.get('/all', auth, userController.findAll);

export default routes;
