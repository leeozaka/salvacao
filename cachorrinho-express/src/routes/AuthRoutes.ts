import { Router } from 'express';
import { Container } from 'container';

const router = Router();
const loginController = Container.getLoginController();

router.post('/', loginController.authenticate);
router.post('/verify', loginController.verifyToken);

export default router;
