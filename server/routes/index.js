import { Router } from 'express';
import User from '../dummy/controllers/User';
import Message from '../dummy/controllers/Message';
import Auth from '../dummy/middlewares/Auth';

const router = Router();

// set api routes/endpoints

router.post('/api/v1/auth/signup', User.createUser);
router.post('/api/v1/auth/login', User.loginUser);
router.get('/api/v1/users', Auth.verifyToken, User.getAllUsers);
router.get('/api/v1/users/:id', Auth.verifyToken, User.getUser);
router.put('/api/v1/users/:id', Auth.verifyToken, User.updateUser);
router.delete('/api/v1/users/:id', Auth.verifyToken, User.deleteUser);

router.post('/api/v1/messages', Auth.verifyToken, Message.createMessage);
router.get('/api/v1/messages', Auth.verifyToken, Message.getAllReceived);
router.get('/api/v1/messages/unread', Auth.verifyToken, Message.getAllUnread);
router.get('/api/v1/messages/sent', Auth.verifyToken, Message.getAllSent);
router.get('/api/v1/messages/:id', Auth.verifyToken, Message.getOne);
router.delete('/api/v1/messages/:id', Auth.verifyToken, Message.delete);

export default router;
