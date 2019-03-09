"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _User = _interopRequireDefault(require("../controllers/User"));

var _Message = _interopRequireDefault(require("../controllers/Message"));

var _Auth = _interopRequireDefault(require("../middlewares/Auth"));

var _validation = _interopRequireDefault(require("../middlewares/validation/validation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)(); // setup api routes/endpoints

router.post('/api/v1/auth/signup', _validation.default.signUp, _User.default.createUser);
router.post('/api/v1/auth/login', _validation.default.login, _User.default.loginUser);
router.get('/api/v1/users', _Auth.default.verifyToken, _User.default.getAllUsers);
router.get('/api/v1/users/:id', _Auth.default.verifyToken, _User.default.getUser);
router.put('/api/v1/users/:id', _Auth.default.verifyToken, _User.default.updateUser);
router.delete('/api/v1/users/:id', _Auth.default.verifyToken, _User.default.deleteUser);
router.post('/api/v1/messages', _validation.default.sendMessage, _Auth.default.verifyToken, _Message.default.createMessage);
router.get('/api/v1/messages', _Auth.default.verifyToken, _Message.default.getAllReceived);
router.get('/api/v1/messages/unread', _Auth.default.verifyToken, _Message.default.getAllUnread);
router.get('/api/v1/messages/sent', _Auth.default.verifyToken, _Message.default.getAllSent);
router.get('/api/v1/messages/:id', _Auth.default.verifyToken, _Message.default.getOne);
router.delete('/api/v1/messages/:id', _Auth.default.verifyToken, _Message.default.delete);
var _default = router;
exports.default = _default;
//# sourceMappingURL=index.js.map