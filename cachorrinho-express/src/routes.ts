import AddressRoutes from 'routes/AddressRoutes';
import UserRoutes from 'routes/UserRoutes';
import AuthRoutes from 'routes/AuthRoutes';
import MedicamentoRoutes from './routes/MedicamentoRoutes';
import { Router } from 'express';

const routes = Router();

routes.use('/user', UserRoutes);
routes.use('/address', AddressRoutes);
routes.use('/login', AuthRoutes);
routes.use('/medicamento', MedicamentoRoutes);

routes.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

export default routes;
