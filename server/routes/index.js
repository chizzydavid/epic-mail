import { Router } from 'express';
import User from '../dummy/controllers/User';

const router = Router();

// set api routes/endpoints

router.post('/api/v1/auth/signup', User.createUser);
router.post('/api/v1/auth/login', User.loginUser);

export default router;
