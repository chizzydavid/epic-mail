import { Router } from 'express';
import User from '../dummy/controllers/User';
import Auth from '../dummy/middlewares/Auth';

const router = Router();

// set api routes/endpoints

router.post('/api/v1/auth/signup', User.createUser);
router.post('/api/v1/auth/login', User.loginUser);
router.get('/api/v1/users', Auth.verifyToken, User.getAllUsers);
router.get('/api/v1/users/:id', Auth.verifyToken, User.getUser);

export default router;
