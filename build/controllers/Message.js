"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _db = _interopRequireDefault(require("../db"));

var _queries = require("../db/queries");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable func-names */
const Message = {
  async sendMessage(req, res) {
    let receiver_id;

    try {
      const result = await _db.default.query(_queries.message.selectUser, [req.values.recipient]);

      if (!result.rows[0]) {
        return res.status(401).json({
          status: 401,
          error: 'Message recipient is not a registered user.'
        });
      }

      receiver_id = result.rows[0].user_id;
      const values = [(0, _moment.default)().format('MMMM Do YYYY, h:mm:ss a'), req.values.subject, req.values.message, req.user.user_id, receiver_id, req.values.parentMessageId || 0, 'sent'];
      const {
        rows
      } = await _db.default.query(_queries.message.insert, values);
      const {
        message_id,
        sender_id
      } = rows[0];
      await _db.default.query(`INSERT INTO inbox (receiver_id, message_id) VALUES (${receiver_id}, ${message_id}) returning *`);
      await _db.default.query(`INSERT INTO outbox (sender_id, message_id) VALUES (${sender_id}, ${message_id}) returning *`);
      return res.status(201).json({
        status: 201,
        data: rows[0]
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error sending your message. ${e}`
      });
    }
  },

  async saveAsDraft(req, res) {
    let receiver_id;

    try {
      if (req.values.recipient !== '') {
        const result = await _db.default.query(_queries.message.selectUser, [req.values.recipient]);

        if (!result.rows[0]) {
          return res.status(401).json({
            status: 401,
            error: 'Message recipient is not a registered user.'
          });
        }

        receiver_id = result.rows[0].user_id;
      }

      const values = [(0, _moment.default)().format('MMMM Do YYYY, h:mm:ss a'), req.values.subject, req.values.message, req.user.user_id, receiver_id || 0, req.values.parentMessageId || 0, 'draft'];
      const {
        rows
      } = await _db.default.query(_queries.message.insert, values);
      const {
        message_id,
        sender_id
      } = rows[0];
      await _db.default.query(`INSERT INTO outbox (sender_id, message_id) VALUES (${sender_id}, ${message_id}) returning *`);
      return res.status(201).json({
        status: 201,
        data: rows[0]
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error saving your draft. ${e}`
      });
    }
  },

  async getAllReceived(req, res) {
    try {
      await _db.default.query(_queries.message.updateStatusUnread, [req.user.user_id]);
      const result = await _db.default.query(_queries.message.selectAllCategory, [req.user.user_id, 'unread']);
      const {
        rows,
        rowCount
      } = await _db.default.query(_queries.message.selectAllReceived, [req.user.user_id]);

      if (rowCount === 0) {
        return res.status(200).json({
          status: 200,
          message: 'You have no received messages.'
        });
      }

      return res.status(200).json({
        status: 200,
        data: [...rows],
        newMsgCount: result.rowCount
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error getting all your received messages. ${e}`
      });
    }
  },

  getCategory(category) {
    return async function (req, res, next) {
      const query = category === 'draft' ? _queries.message.selectAllDrafts : _queries.message.selectAllCategory;

      try {
        const {
          rows,
          rowCount
        } = await _db.default.query(query, [req.user.user_id, category]);

        if (rowCount === 0) {
          return res.status(200).json({
            status: 200,
            message: `You have no ${category} messages.`
          });
        }

        return res.status(200).json({
          status: 200,
          data: [...rows]
        });
      } catch (e) {
        return res.status(400).json({
          status: 400,
          error: `There was an error getting your ${category} messages. ${e}`
        });
      }
    };
  },

  async getAllSent(req, res) {
    try {
      const {
        rows,
        rowCount
      } = await _db.default.query(_queries.message.selectAllSent, [req.user.user_id]);

      if (rowCount === 0) {
        return res.status(200).json({
          status: 200,
          message: 'You haven\'t sent any messages.'
        });
      }

      return res.status(200).json({
        status: 200,
        data: [...rows]
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error getting your sent messages. ${e}`
      });
    }
  },

  async getSingleMessage(req, res) {
    try {
      let result;
      const allMessages = [];
      let parentMessageId = req.params.id;

      do {
        result = await _db.default.query(_queries.message.selectByIdJoinUser, [parentMessageId]);
        allMessages.unshift(result.rows[0]);
        parentMessageId = result.rows[0].parent_msg_id;
      } while (Number(parentMessageId));

      return res.status(200).json({
        status: 200,
        data: allMessages
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error retrieving this Message. ${e}`
      });
    }
  },

  async updateToRead(req, res) {
    try {
      await _db.default.query(_queries.message.updateStatusRead, [req.user.user_id, req.params.id]);
      return res.status(200).json({
        status: 200,
        message: 'Message status successfully updated.'
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error changing the status of this message. ${e}`
      });
    }
  },

  async retractMessage(req, res) {
    try {
      let result;
      const {
        rows
      } = await _db.default.query(_queries.message.selectReceiver, [req.params.id]);

      if (!Number(rows[0].receiver_id)) {
        result = await _db.default.query(_queries.message.deleteAllReceived, [req.params.id]);
      } else {
        result = await _db.default.query(_queries.message.deleteReceived, [rows[0].receiver_id, req.params.id]);
      }

      await _db.default.query(_queries.message.updateStatusDraft, [req.params.id]);

      if (!result.rows[0]) {
        return res.status(200).json({
          status: 200,
          message: 'Message successfully retracted.'
        });
      }
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error retracting this Message. ${e}`
      });
    }
  },

  async deleteReceivedMessage(req, res) {
    try {
      const result = await _db.default.query(_queries.message.deleteReceived, [req.user.user_id, req.params.id]);

      if (!result.rows[0]) {
        return res.status(200).json({
          status: 200,
          message: 'Message successfully deleted.'
        });
      }
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error deleting this Message. ${e}`
      });
    }
  },

  async deleteSentMessage(req, res) {
    try {
      const result = await _db.default.query(_queries.message.deleteSent, [req.user.user_id, req.params.id]);

      if (!result.rows[0]) {
        return res.status(200).json({
          status: 200,
          message: 'Message successfully deleted.'
        });
      }
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error deleting this Message. ${e}`
      });
    }
  }

};
var _default = Message;
exports.default = _default;
//# sourceMappingURL=Message.js.map