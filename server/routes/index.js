import { Router } from 'express';
import User from '../controllers/User';
import Message from '../controllers/Message';
import Validate from '../middlewares/validation/validation';

const router = Router();

// setup api routes/endpoints
router.post('/api/v1/auth/signup', Validate.signUp, User.createUser);
router.post('/api/v1/auth/login', Validate.login, User.loginUser);
router.get('/api/v1/users', User.getAllUsers);
router.get('/api/v1/users/:id', User.getSingleUser);
router.delete('/api/v1/users/:id', User.deleteUser);

router.post('/api/v1/messages', Validate.sendMessage, Message.createMessage);
router.get('/api/v1/messages', Message.getAllReceived);
router.get('/api/v1/messages/unread', Message.getAllUnread);
router.get('/api/v1/messages/sent', Message.getAllSent);
router.get('/api/v1/messages/:id', Message.getOne);
router.delete('/api/v1/messages/:id', Message.delete);

export default router;
