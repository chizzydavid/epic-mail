"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _User = _interopRequireDefault(require("../dummy/models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var User = {
  createUser: function createUser(req, res) {
    var newUser = _User.default.create(req.body);

    return res.status(201).json({
      status: 201,
      data: _objectSpread({}, newUser)
    });
  },
  loginUser: function loginUser(req, res) {
    var _req$body = req.body,
        email = _req$body.email,
        password = _req$body.password;

    var userLogin = _User.default.login({
      email: email,
      password: password
    });

    if (userLogin.message === 'User not found') {
      return res.status(404).json({
        status: 404,
        error: 'User not found.'
      });
    }

    if (userLogin.message === 'Invalid password') {
      return res.status(400).json({
        status: 400,
        error: 'Invalid password.'
      });
    }

    return res.status(200).json({
      status: 200,
      data: _objectSpread({}, userLogin)
    });
  },
  getAllUsers: function getAllUsers(req, res) {
    var users = _User.default.findAll();

    return res.status(200).json({
      status: 200,
      data: _toConsumableArray(users)
    });
  },
  getUser: function getUser(req, res) {
    var user = _User.default.findUser(Number(req.params.id));

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'User not found.'
      });
    }

    return res.status(200).json({
      status: 200,
      data: _objectSpread({}, user)
    });
  },
  updateUser: function updateUser(req, res) {
    var user = _User.default.findUser(Number(req.params.id));

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'User not found.'
      });
    }

    var updatedUser = _User.default.update(req.params.id, req.body);

    return res.status(201).json({
      status: 201,
      data: _objectSpread({}, updatedUser)
    });
  },
  deleteUser: function deleteUser(req, res) {
    var user = _User.default.findUser(Number(req.params.id));

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'User not found.'
      });
    }

    var ref = _User.default.delete(req.params.id);

    return res.status(204).send(ref);
  }
};
var _default = User;
exports.default = _default;
//# sourceMappingURL=User.js.map