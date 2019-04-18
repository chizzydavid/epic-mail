import moment from 'moment';
import db from '../db';
import { message } from '../db/queries';

const Message = {

  async sendMessage(req, res) {
    let receiver_id;
    try {
      const result = await db.query(message.selectUser, [req.values.recipient]);
      if (!result.rows[0]) {
        return res.status(401).json({
          status: 401,
          error: 'Message recipient is not a registered user.',
        });
      }

      receiver_id = result.rows[0].user_id;
      const values = [
        moment().format('MMMM Do YYYY, h:mm:ss a'),
        req.values.subject,
        req.values.message,
        req.user.id,
        receiver_id,
        req.values.parentMessageId || 0,
        'sent',
      ];
      const { rows } = await db.query(message.insert, values);
      const { message_id, sender_id } = rows[0];
      await db.query(`INSERT INTO inbox (receiver_id, message_id) VALUES (${receiver_id}, ${message_id}) returning *`);
      await db.query(`INSERT INTO outbox (sender_id, message_id) VALUES (${sender_id}, ${message_id}) returning *`);
      return res.status(201).json({
        status: 201,
        data: [rows[0]],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error sending your message. ${e}`,
      });
    }
  },

  async saveAsDraft(req, res) {
    let receiver_id;
    try {
      if (req.values.recipient !== '') {
        const result = await db.query(message.selectUser, [req.values.recipient]);
        if (!result.rows[0]) {
          return res.status(401).json({
            status: 401,
            error: 'Message recipient is not a registered user.',
          });
        }
        receiver_id = result.rows[0].user_id;
      }

      const values = [
        moment().format('MMMM Do YYYY, h:mm:ss a'),
        req.values.subject,
        req.values.message,
        req.user.id,
        receiver_id || 0,
        req.values.parentMessageId || 0,
        'draft',
      ];

      const { rows } = await db.query(message.insert, values);
      const { message_id, sender_id } = rows[0];
      await db.query(`INSERT INTO outbox (sender_id, message_id) VALUES (${sender_id}, ${message_id}) returning *`);

      return res.status(201).json({
        status: 201,
        data: [rows[0]],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error saving your draft. ${e}`,
      });
    }
  },

  async getAllReceived(req, res) {
    try {
      await db.query(message.updateStatusUnread, [req.user.id]);
      const { rows, rowCount } = await db.query(message.selectAllReceived, [req.user.id]);
      if (rowCount === 0) {
        return res.status(200).json({
          status: 200,
          message: 'You have no received messages.',
        });
      }
      return res.status(200).json({
        status: 200,
        data: [...rows],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error getting all your received messages. ${e}`,
      });
    }
  },

  getCategory(category) {
    return async function (req, res, next) {
      const query = category === 'draft' ? message.selectAllDrafts : message.selectAllCategory;
      try {
        const { rows, rowCount } = await db.query(query, [req.user.id, category]);
        if (rowCount === 0) {
          return res.status(200).json({
            status: 200,
            message: `You have no ${category} messages.`,
          });
        }

        return res.status(200).json({
          status: 200,
          data: [...rows],
        });
      } catch (e) {
        return res.status(400).json({
          status: 400,
          error: `There was an error getting your ${category} messages. ${e}`,
        });
      }
    };
  },

  async getAllSent(req, res) {
    try {
      const { rows, rowCount } = await db.query(message.selectAllSent, [req.user.id]);
      if (rowCount === 0) {
        return res.status(200).json({
          status: 200,
          message: 'You haven\'t sent any messages.',
        });
      }

      return res.status(200).json({
        status: 200,
        data: [...rows],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error getting your sent messages. ${e}`,
      });
    }
  },

  async getSingleMessage(req, res) {
    try {
      let result; const allMessages = [];
      let parentMessageId = req.params.id;

      do {
        result = await db.query(message.selectByIdJoinUser, [parentMessageId]);
        allMessages.unshift(result.rows[0]);
        parentMessageId = result.rows[0].parent_msg_id;
      } while (Number(parentMessageId));

      return res.status(200).json({
        status: 200,
        data: allMessages,
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error retrieving this Message. ${e}`,
      });
    }
  },

  async updateToRead(req, res) {
    try {
      await db.query(message.updateStatusRead, [req.user.id, req.params.id]);
      return res.status(200).json({
        status: 200,
        message: 'Message status successfully updated.',
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error changing the status of this message. ${e}`,
      });
    }
  },

  async retractMessage(req, res) {
    try {
      let result;
      const { rows } = await db.query(message.selectReceiver, [req.params.id]);

      if (!Number(rows[0].receiver_id)) {
        result = await db.query(message.deleteAllReceived, [req.params.id]);
      } else {
        result = await db.query(message.deleteReceived, [rows[0].receiver_id, req.params.id]);
      }

      await db.query(message.updateStatusDraft, [req.params.id]);
      if (!result.rows[0]) {
        return res.status(200).json({
          status: 200,
          message: 'Message successfully retracted.',
        });
      }
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error retracting this Message. ${e}`,
      });
    }
  },

  async deleteReceivedMessage(req, res) {
    try {
      const result = await db.query(message.deleteReceived, [req.user.id, req.params.id]);
      if (!result.rows[0]) {
        return res.status(200).json({
          status: 200,
          message: 'Message successfully deleted.',
        });
      }
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error deleting this Message. ${e}`,
      });
    }
  },

  async deleteSentMessage(req, res) {
    try {
      const result = await db.query(message.deleteSent, [req.user.id, req.params.id]);
      if (!result.rows[0]) {
        return res.status(200).json({
          status: 200,
          message: 'Message successfully deleted.',
        });
      }
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error deleting this Message. ${e}`,
      });
    }
  },
};
export default Message;
