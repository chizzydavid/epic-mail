import { Router } from 'express';
import User from '../controllers/User';
import Message from '../controllers/Message';
import Group from '../controllers/Group';
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
router.delete('/api/v2/messages/:id', Auth.verifyToken, Message.deleteReceivedMessage);

router.post('/api/v2/groups', Validate.newGroup, Auth.verifyToken, Group.createGroup);
router.get('/api/v2/groups', Auth.verifyToken, Group.getAllUserGroups);
router.get('/api/v2/groups/:groupId', Auth.verifyToken, Group.getSingleGroup);
router.patch('/api/v2/groups/:groupId/:name', Auth.verifyToken, Group.editGroupName);
router.post('/api/v2/groups/:groupId/users', Auth.verifyToken, Group.addUserToGroup);
router.delete('/api/v2/groups/:groupId/users/:id', Auth.verifyToken, Group.deleteUserFromGroup);
router.post('/api/v2/groups/:groupId/messages', Validate.sendMessage, Auth.verifyToken, Group.sendMessageToGroup);
router.delete('/api/v2/groups/:groupId', Auth.verifyToken, Group.deleteGroup);


export default router;
