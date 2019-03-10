"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Message = _interopRequireDefault(require("../dummy/models/Message"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Message = {
  createMessage: function createMessage(req, res) {
    var newMessage = _Message.default.create(req.body);

    return res.status(201).json({
      status: 201,
      data: _objectSpread({}, newMessage)
    });
  },
  getAllReceived: function getAllReceived(req, res) {
    var messages = _Message.default.findAllReceived(req.user.id);

    return res.status(200).json({
      status: 200,
      data: _toConsumableArray(messages)
    });
  },
  getAllUnread: function getAllUnread(req, res) {
    var messages = _Message.default.findAllUnread(req.user.id);

    return res.status(200).json({
      status: 200,
      data: _toConsumableArray(messages)
    });
  },
  getAllSent: function getAllSent(req, res) {
    var messages = _Message.default.findAllSent(req.user.id);

    return res.status(200).json({
      status: 200,
      data: _toConsumableArray(messages)
    });
  },
  getOne: function getOne(req, res) {
    var message = _Message.default.findOne(Number(req.params.id));

    if (!message) {
      return res.status(404).json({
        status: 404,
        error: 'Message not found.'
      });
    }

    return res.status(200).json({
      status: 200,
      data: _objectSpread({}, message)
    });
  },
  delete: function _delete(req, res) {
    var message = _Message.default.findOne(Number(req.params.id));

    if (!message) {
      return res.status(404).json({
        status: 404,
        error: 'Message not found.'
      });
    }

    var ref = _Message.default.delete(Number(req.params.id));

    return res.status(204).json(ref);
  }
};
var _default = Message;
exports.default = _default;
//# sourceMappingURL=Message.js.map