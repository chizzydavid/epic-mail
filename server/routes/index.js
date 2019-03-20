import { Router } from 'express';
import User from '../controllers/User';
import Validate from '../middlewares/validation/validation';

const router = Router();

// setup api routes/endpoints
router.post('/api/v2/auth/signup', Validate.signUp, User.createUser);
router.post('/api/v2/auth/login', Validate.login, User.loginUser);


export default router;
