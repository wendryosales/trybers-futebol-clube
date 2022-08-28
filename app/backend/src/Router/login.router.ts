import { Router } from 'express';
import LoginController from '../controller/login.controller';

const router = Router();

const loginController = new LoginController();

router.post('/', (req, res) => loginController.login(req, res));
router.get('/validate', (req, res) => loginController.validate(req, res));

export default router;
