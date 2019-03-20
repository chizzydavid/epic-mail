import { Router } from 'express';
import User from '../controllers/User';
import Validate from '../middlewares/validation/validation';
import Auth from '../middlewares/Auth';

const router = Router();

// setup api routes/endpoints
router.post('/api/v2/auth/signup', Validate.signUp, User.createUser);
router.post('/api/v2/auth/login', Validate.login, User.loginUser);
router.get('/api/v2/users', Auth.verifyToken, User.getAllUsers);


export default router;
