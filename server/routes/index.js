import { Router } from 'express';
import User from '../controllers/User';
import Validate from '../middlewares/validation/validation';

const router = Router();

// setup api routes/endpoints
router.post('/api/v1/auth/signup', Validate.signUp, User.createUser);


export default router;
