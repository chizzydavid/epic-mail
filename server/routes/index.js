import { Router } from 'express';
import User from '../controllers/User';
import Validate from '../middlewares/validation/validation';

const router = Router();

// setup api routes/endpoints
router.post('/api/v1/auth/signup', Validate.signUp, User.createUser);
router.post('/api/v1/auth/login', Validate.login, User.loginUser);
router.get('/api/v1/users', User.getAllUsers);
router.get('/api/v1/users/:id', User.getSingleUser);
router.delete('/api/v1/users/:id', User.deleteUser);


export default router;
