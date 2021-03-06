"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _multer = _interopRequireDefault(require("multer"));

var _cloudinary = _interopRequireDefault(require("cloudinary"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _path = _interopRequireDefault(require("path"));

var _User = _interopRequireDefault(require("../controllers/User"));

var _Message = _interopRequireDefault(require("../controllers/Message"));

var _Group = _interopRequireDefault(require("../controllers/Group"));

var _validation = _interopRequireDefault(require("../middlewares/validation/validation"));

var _Auth = _interopRequireDefault(require("../middlewares/Auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const router = (0, _express.Router)(); // multer configuration

const storage = _multer.default.diskStorage({
  destination: './server/uploads',
  filename: (req, file, cb) => {
    const {
      email
    } = req.body;
    const [name] = email.trim().split('@');
    const ext = _path.default.extname(file.originalname) || '.jpg';
    cb(null, name + ext);
  }
});

const upload = (0, _multer.default)({
  storage,
  limits: {
    fileSize: 200000
  },
  fileFilter: (req, file, cb) => {
    if (/image\//.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb('Error: Upload an image file.');
    }
  }
}).single('photo'); // cloudinary configuration

_cloudinary.default.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}); // upload image file to the server


const uploadFile = (req, res, next) => {
  upload(req, res, e => {
    if (e) {
      return res.status(400).json({
        status: 400,
        error: `Error uploading image. ${e}`
      });
    } // upload image from local server to cloudinary server
    // extract name of image file excluding the extension


    if (req.file) {
      const imgName = req.file.filename.replace(/.\w+$/, '');

      _cloudinary.default.v2.uploader.upload(req.file.path, {
        public_id: imgName
      }, err => {
        if (err) {
          return res.status(400).json({
            status: 400,
            error: `Error uploading image. ${err}`
          });
        }
      });
    }

    next();
  });
};

router.post('/api/v2/auth/signup', uploadFile, _validation.default.signUp, _User.default.createUser);
router.post('/api/v2/auth/login', _validation.default.login, _User.default.loginUser);
router.get('/api/v2/users', _Auth.default.verifyToken, _User.default.getAllUsers);
router.get('/api/v2/users/:id', _Auth.default.verifyToken, _User.default.getSingleUser);
router.delete('/api/v2/users/:id', _Auth.default.verifyToken, _User.default.deleteUser);
router.post('/api/v2/messages', _validation.default.sendMessage, _Auth.default.verifyToken, _Message.default.sendMessage);
router.post('/api/v2/messages/draft', _validation.default.saveDraft, _Auth.default.verifyToken, _Message.default.saveAsDraft);
router.get('/api/v2/messages', _Auth.default.verifyToken, _Message.default.getAllReceived);
router.get('/api/v2/messages/unread', _Auth.default.verifyToken, _Message.default.getCategory('unread'));
router.get('/api/v2/messages/read', _Auth.default.verifyToken, _Message.default.getCategory('read'));
router.get('/api/v2/messages/draft', _Auth.default.verifyToken, _Message.default.getCategory('draft'));
router.get('/api/v2/messages/sent', _Auth.default.verifyToken, _Message.default.getAllSent);
router.get('/api/v2/messages/:id', _Auth.default.verifyToken, _Auth.default.verifyMessage, _Message.default.getSingleMessage);
router.patch('/api/v2/messages/:id', _Auth.default.verifyToken, _Auth.default.verifyMessage, _Message.default.updateToRead);
router.delete('/api/v2/messages/retract/:id', _Auth.default.verifyToken, _Auth.default.verifyMessage, _Message.default.retractMessage);
router.delete('/api/v2/messages/sent/:id', _Auth.default.verifyToken, _Auth.default.verifyMessage, _Message.default.deleteSentMessage);
router.delete('/api/v2/messages/:id', _Auth.default.verifyToken, _Auth.default.verifyMessage, _Message.default.deleteReceivedMessage);
router.post('/api/v2/groups', _validation.default.newGroup, _Auth.default.verifyToken, _Group.default.createGroup);
router.get('/api/v2/groups', _Auth.default.verifyToken, _Group.default.getAllUserGroups);
router.get('/api/v2/groups/:groupId', _Auth.default.verifyToken, _Auth.default.verifyGroup, _Group.default.getSingleGroup);
router.put('/api/v2/groups/:groupId', _validation.default.newGroup, _Auth.default.verifyToken, _Auth.default.verifyGroup, _Group.default.editGroup);
router.post('/api/v2/groups/:groupId/users', _Auth.default.verifyToken, _Auth.default.verifyGroup, _Group.default.addUserToGroup);
router.delete('/api/v2/groups/:groupId/users/:id', _Auth.default.verifyToken, _Auth.default.verifyGroup, _Group.default.deleteUserFromGroup);
router.post('/api/v2/groups/:groupId/messages', _validation.default.sendMessage, _Auth.default.verifyToken, _Auth.default.verifyGroup, _Group.default.sendMessageToGroup);
router.delete('/api/v2/groups/:groupId', _Auth.default.verifyToken, _Auth.default.verifyGroup, _Group.default.deleteGroup);
var _default = router;
exports.default = _default;
//# sourceMappingURL=index.js.map