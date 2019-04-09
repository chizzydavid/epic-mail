import { Router } from 'express';
import User from '../controllers/User';
import Message from '../controllers/Message';
import Group from '../controllers/Group';
import Validate from '../middlewares/validation/validation';
import Auth from '../middlewares/Auth';
import multer from 'multer';
import path from 'path';

const router = Router();
const storage = multer.diskStorage({
	destination: './server/uploads',
	filename: (req, file, cb) => {
		const { email } = req.body;
		const [ name ] = email.trim().split('@');
		const ext = path.extname(file.originalname) || '.jpg';
		cb(null, name + ext);
	}
})

const upload = multer({
	storage: storage,
	limits: {fileSize: 200000},
	fileFilter: (req, file, cb) => {
		if (/image\//.test(file.mimetype)) 
			cb(null, true);
		else 
			cb(`Error: Upload an image file.`)
	}
}).single('photo');

const uploadFile = (req, res, next) => {
	upload(req, res, (e) => {
		if (e) {
			return res.status(400).json({
				status: 400,
				error: `Error uploading image. ${e}`
			})
		}
		next();
	})
}

router.post('/api/v2/auth/signup', uploadFile, Validate.signUp, User.createUser);
router.post('/api/v2/auth/login', Validate.login, User.loginUser);
router.get('/api/v2/users', Auth.verifyToken, User.getAllUsers);
router.get('/api/v2/users/:id', Auth.verifyToken, User.getSingleUser);
router.delete('/api/v2/users/:id', Auth.verifyToken, User.deleteUser);

router.post('/api/v2/messages', Validate.sendMessage, Auth.verifyToken, Message.sendMessage);
router.post('/api/v2/messages/draft', Validate.saveDraft, Auth.verifyToken, Message.saveAsDraft);
router.get('/api/v2/messages', Auth.verifyToken, Message.getAllReceived);
router.get('/api/v2/messages/unread', Auth.verifyToken, Message.getAllCategory('unread'));
router.get('/api/v2/messages/read', Auth.verifyToken, Message.getAllCategory('read'));
router.get('/api/v2/messages/draft', Auth.verifyToken, Message.getAllCategory('draft'));
router.get('/api/v2/messages/sent', Auth.verifyToken, Message.getAllSent);
router.get('/api/v2/messages/:id', Auth.verifyToken, Auth.verifyMessage, Message.getSingleMessage);
router.patch('/api/v2/messages/:id', Auth.verifyToken, Auth.verifyMessage, Message.updateToRead);
router.delete('/api/v2/messages/retract/:id', Auth.verifyToken, Auth.verifyMessage, Message.retractMessage);
router.delete('/api/v2/messages/sent/:id', Auth.verifyToken, Auth.verifyMessage, Message.deleteSentMessage);
router.delete('/api/v2/messages/:id', Auth.verifyToken, Auth.verifyMessage, Message.deleteReceivedMessage);

router.post('/api/v2/groups', Validate.newGroup, Auth.verifyToken, Group.createGroup);
router.get('/api/v2/groups', Auth.verifyToken, Group.getAllUserGroups);
router.get('/api/v2/groups/:groupId', Auth.verifyToken, Auth.verifyGroup, Group.getSingleGroup);
router.patch('/api/v2/groups/:groupId/:name', Auth.verifyToken, Auth.verifyGroup, Group.editGroupName);
router.post('/api/v2/groups/:groupId/users', Auth.verifyToken, Auth.verifyGroup, Group.addUserToGroup);
router.delete('/api/v2/groups/:groupId/users/:id', Auth.verifyToken, Auth.verifyGroup, Group.deleteUserFromGroup);
router.post('/api/v2/groups/:groupId/messages', Validate.sendMessage, Auth.verifyToken, Auth.verifyGroup, Group.sendMessageToGroup);
router.delete('/api/v2/groups/:groupId', Auth.verifyToken, Auth.verifyGroup, Group.deleteGroup);

export default router;
