import { Router } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import User from '../controllers/User';
import Message from '../controllers/Message';
import Group from '../controllers/Group';
import Validate from '../middlewares/validation/validation';
import Auth from '../middlewares/Auth';


dotenv.config();
const router = Router();

// multer configuration
const storage = multer.diskStorage({
  destination: './server/uploads',
  filename: (req, file, cb) => {
    const { email } = req.body;
    const [name] = email.trim().split('@');
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, name + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200000 },
  fileFilter: (req, file, cb) => {
    if (/image\//.test(file.mimetype)) { cb(null, true); } else { cb('Error: Upload an image file.'); }
  },
}).single('photo');

// cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload image file to the server
const uploadFile = (req, res, next) => {
  upload(req, res, (e) => {
    if (e) {
      return res.status(400).json({
        status: 400,
        error: `Error uploading image. ${e}`,
      });
    }

    // upload image from local server to cloudinary server

    // extract name of image file excluding the extension
    if (req.file) {
      const imgName = req.file.filename.replace(/.\w+$/, '');
      cloudinary.v2.uploader.upload(req.file.path, { public_id: imgName }, (err) => {
        if (err) {
          return res.status(400).json({
            status: 400,
            error: `Error uploading image. ${err}`,
          });
        }
      });
    }
    next();
  });
};


router.get('/api/v2/test', () => {});
router.post('/api/v2/auth/signup', uploadFile, Validate.signUp, User.createUser);
router.post('/api/v2/auth/login', Validate.login, User.loginUser);
router.get('/api/v2/users', Auth.verifyToken, User.getAllUsers);
router.get('/api/v2/users/:id', Auth.verifyToken, User.getSingleUser);
router.delete('/api/v2/users/:id', Auth.verifyToken, User.deleteUser);

router.post('/api/v2/messages', Validate.sendMessage, Auth.verifyToken, Message.sendMessage);
router.post('/api/v2/messages/draft', Validate.saveDraft, Auth.verifyToken, Message.saveAsDraft);
router.get('/api/v2/messages', Auth.verifyToken, Message.getAllReceived);
router.get('/api/v2/messages/unread', Auth.verifyToken, Message.getCategory('unread'));
router.get('/api/v2/messages/read', Auth.verifyToken, Message.getCategory('read'));
router.get('/api/v2/messages/draft', Auth.verifyToken, Message.getCategory('draft'));
router.get('/api/v2/messages/sent', Auth.verifyToken, Message.getAllSent);
router.get('/api/v2/messages/:id', Auth.verifyToken, Auth.verifyMessage, Message.getSingleMessage);
router.patch('/api/v2/messages/:id', Auth.verifyToken, Auth.verifyMessage, Message.updateToRead);
router.delete('/api/v2/messages/retract/:id', Auth.verifyToken, Auth.verifyMessage, Message.retractMessage);
router.delete('/api/v2/messages/sent/:id', Auth.verifyToken, Auth.verifyMessage, Message.deleteSentMessage);
router.delete('/api/v2/messages/:id', Auth.verifyToken, Auth.verifyMessage, Message.deleteReceivedMessage);

router.post('/api/v2/groups', Validate.newGroup, Auth.verifyToken, Group.createGroup);
router.get('/api/v2/groups', Auth.verifyToken, Group.getAllUserGroups);
router.get('/api/v2/groups/:groupId', Auth.verifyToken, Auth.verifyGroup, Group.getSingleGroup);
router.put('/api/v2/groups/:groupId', Validate.newGroup, Auth.verifyToken, Auth.verifyGroup, Group.editGroup);
router.post('/api/v2/groups/:groupId/users', Auth.verifyToken, Auth.verifyGroup, Group.addUserToGroup);
router.delete('/api/v2/groups/:groupId/users/:id', Auth.verifyToken, Auth.verifyGroup, Group.deleteUserFromGroup);
router.post('/api/v2/groups/:groupId/messages', Validate.sendMessage, Auth.verifyToken, Auth.verifyGroup, Group.sendMessageToGroup);
router.delete('/api/v2/groups/:groupId', Auth.verifyToken, Auth.verifyGroup, Group.deleteGroup);

export default router;
