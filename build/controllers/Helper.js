"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

var Helper = {
  generateToken: function generateToken(id) {
    return _jsonwebtoken.default.sign({
      userId: id
    }, process.env.SECRETKEY);
  }
};
var _default = Helper;
exports.default = _default;
//# sourceMappingURL=Helper.js.map