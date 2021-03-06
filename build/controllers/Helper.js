"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const Helper = {
  generateToken(user) {
    return _jsonwebtoken.default.sign({
      user
    }, process.env.SECRETKEY, {
      expiresIn: '7d'
    });
  },

  hashPassword(password) {
    return _bcryptjs.default.hashSync(password, _bcryptjs.default.genSaltSync(8));
  },

  comparePassword(password, hashPassword) {
    return _bcryptjs.default.compareSync(password, hashPassword);
  }

};
var _default = Helper;
exports.default = _default;
//# sourceMappingURL=Helper.js.map