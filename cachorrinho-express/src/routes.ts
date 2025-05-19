import AddressRoutes from 'routes/AddressRoutes';
import UserRoutes from 'routes/UserRoutes';
import AuthRoutes from 'routes/AuthRoutes';
import MedicamentoRoutes from './routes/MedicamentoRoutes';
import TipoProdutoRoutes from './routes/TipoProdutoRoutes';
import UnidadeMedidaRoutes from './routes/UnidadeMedidaRoutes';
import AdotanteRoutes from 'routes/AdotanteRoutes';

import { Router } from 'express';

const routes = Router();

routes.use('/user', UserRoutes);
routes.use('/address', AddressRoutes);
routes.use('/login', AuthRoutes);
routes.use('/medicamento', MedicamentoRoutes);
routes.use('/tipo-produto', TipoProdutoRoutes);
routes.use('/unidade-medida', UnidadeMedidaRoutes);
routes.use('/adotantes', AdotanteRoutes);

routes.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

export default routes;
