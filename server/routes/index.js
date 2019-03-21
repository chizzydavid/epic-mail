import { Router } from 'express';
import User from '../controllers/User';
import Message from '../controllers/Message';
import Validate from '../middlewares/validation/validation';
import Auth from '../middlewares/Auth';

const router = Router();

// setup api routes/endpoints
router.post('/api/v2/auth/signup', Validate.signUp, User.createUser);
router.post('/api/v2/auth/login', Validate.login, User.loginUser);
router.get('/api/v2/users', Auth.verifyToken, User.getAllUsers);
router.get('/api/v2/users/:id', Auth.verifyToken, User.getSingleUser);
router.delete('/api/v2/users/:id', Auth.verifyToken, User.deleteUser);

router.post('/api/v2/messages', Validate.sendMessage, Auth.verifyToken, Message.sendMessage);
router.get('/api/v2/messages', Auth.verifyToken, Message.getAllReceived);
router.get('/api/v2/messages/unread', Auth.verifyToken, Message.getAllUnread);
router.get('/api/v2/messages/sent', Auth.verifyToken, Message.getAllSent);
router.get('/api/v2/messages/:id', Auth.verifyToken, Message.getSingleMessage);

export default router;
 