import { Router } from 'express';
import { Container } from '../container';

const routes = Router();
const adotanteController = Container.getAdotanteController();
const auth = Container.getAuthMiddleware();

routes.post('/', auth, adotanteController.create);
routes.get('/:id', auth, adotanteController.findOne);
routes.get('/', auth, adotanteController.findAll);
routes.delete('/:id', auth, adotanteController.delete);
routes.put('/:id', auth, adotanteController.update);

export default routes;
