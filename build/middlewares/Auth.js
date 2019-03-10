"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

var Auth = {
  verifyToken: function verifyToken(req, res, next) {
    var token = req.headers['access-token'];

    if (!token) {
      res.status(400).json({
        status: 401,
        error: 'No Authentication Token Provided.'
      });
      return;
    }

    try {
      var decoded = _jsonwebtoken.default.verify(token, process.env.SECRETKEY);

      req.user = {
        id: decoded.userId
      };
      next();
    } catch (e) {
      res.status(400).json({
        status: 400,
        error: "There was an error processing your request. ".concat(e)
      });
    }
  }
};
var _default = Auth;
exports.default = _default;
//# sourceMappingURL=Auth.js.map