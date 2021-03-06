"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _db = _interopRequireDefault(require("../db"));

var _queries = require("../db/queries");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const Auth = {
  verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        status: 401,
        error: 'No Authentication Token Provided.'
      });
    }

    try {
      const decoded = _jsonwebtoken.default.verify(token, process.env.SECRETKEY);

      req.user = decoded.user;
      next();
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error processing your request. ${e}`
      });
    }
  },

  async verifyMessage(req, res, next) {
    try {
      const {
        rows
      } = await _db.default.query(_queries.message.verifyQuery, [req.params.id]);

      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Message not found.'
        });
      } // if rows contains more than one object then the message was sent to a group
      // confirm if user was a member of the group that received the message


      if (rows.length > 1) {
        const authorized = rows.some(messg => messg.receiver_id === req.user.user_id || messg.sender_id === req.user.user_id);

        if (!authorized) {
          return res.status(400).json({
            status: 400,
            error: 'Unauthorized access.'
          });
        }
      } else if (req.user.user_id !== rows[0].sender_id && req.user.user_id !== rows[0].receiver_id) {
        return res.status(400).json({
          status: 400,
          error: 'Unauthorized access.'
        });
      }

      next();
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error verifying this Message. ${e}`
      });
    }
  },

  async verifyGroup(req, res, next) {
    try {
      const {
        rows
      } = await _db.default.query(_queries.group.selectByGroupId, [req.params.groupId]);

      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Group not found.'
        });
      }

      if (req.user.user_id !== rows[0].owner_id) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access.'
        });
      }

      next();
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error verifying group. ${e}`
      });
    }
  }

};
var _default = Auth;
exports.default = _default;
//# sourceMappingURL=Auth.js.map