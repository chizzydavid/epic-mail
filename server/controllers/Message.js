import moment from 'moment';
import db from '../db';
import { message } from '../db/queries';

const Message = {

  async sendMessage(req, res) {
    let receiver_id;
    try {
      const { rows } = await db.query(message.selectUser, [req.values.receiver]);
      if (!rows[0]) { 
				return res.status(401).json({ 
          status: 401, 
          error: 'Message Recipient doesn\'t exist on the db.' 
        }); 
			}
      receiver_id = rows[0].user_id;
    } catch (e) {
      return res.status(400).json({ 
        status: 400, 
        error: `There was an error sending your message. ${e}` 
      });
    }

    const values = [
      moment().format('MMMM Do YYYY, h:mm:ss a'),
      req.values.subject,
      req.values.message,
      req.user.id,
      receiver_id,
      req.values.parentMessageId || 0,
      'sent',
    ];
    try {
      const { rows } = await db.query(message.insert, values);
      const { message_id, sender_id } = rows[0];

      await db.query(`INSERT INTO inbox (receiver_id, message_id) VALUES (${receiver_id}, ${message_id})`);
      await db.query(`INSERT INTO outbox (sender_id, message_id) VALUES (${sender_id}, ${message_id})`);

      return res.status(201).json({ 
        status: 201, 
        data: [rows[0]] 
      });
    } catch (e) {
      return res.status(400).json({ 
        status: 400, 
        error: `There was an error sending your message. ${e}` 
      });
    }
  },

  async getAllReceived(req, res) {
    try {
      const { rows, rowCount } = await db.query(message.selectAllReceived, [req.user.id]);
      if (rowCount === 0) { 
        return res.status(200).json({ 
          status: 200, 
          message: 'You have no received messages yet.' 
        }); 
      }
      return res.status(200).json({ 
        status: 200, 
        data: [{ rowCount }, [...rows]] 
      });
    } catch (e) {
      return res.status(400).json({ 
        status: 400, 
        error: `There was an error getting all your received messages. ${e}` 
      });
    }
  },

  async getAllUnread(req, res) {
    try {
      const { rows, rowCount } = await db.query(message.selectAllUnread, [req.user.id, 'unread']);
      if (rowCount === 0) { 
        return res.status(200).json({ 
          status: 400, 
          message: 'You have no unread messages at this time.' 
        }); 
      }
      return res.status(200).json({ 
        status: 200, 
        data: [{ rowCount }, [...rows]] 
      });
    } catch (e) {
      return res.status(400).json({ 
        status: 400, 
        error: `There was an error getting your unread messages. ${e}` 
      });
    }
  },

  async getAllSent(req, res) {
    try {
      const { rows, rowCount } = await db.query(message.selectAllSent, [req.user.id]);
      if (rowCount === 0) { 
        return res.status(200).json({ 
          status: 400, 
          message: 'You haven\'t sent any messages yet.' 
        }); 
      }
      return res.status(200).json({ 
        status: 200, 
        data: [{ rowCount }, [...rows]] 
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
      const { rows } = await db.query(message.selectById, [req.params.id]);
      return res.status(200).json({ 
        status: 200, 
        data: [rows[0]] 
      });
    } catch (e) {
      return res.status(400).json({ 
        status: 400, 
        error: `There was an error retrieving this Message. ${e}` 
      });
    }
	},

  async retractMessage(req, res) {
    try {
      const { rowCount } = await db.query(message.deleteReceived, [req.user.id, req.params.id]);
      if (rowCount === 0) {
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
      const { rowCount } = await db.query(message.deleteReceived, [req.user.id, req.params.id]);
      if (rowCount === 0) {
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
      const { rowCount } = await db.query(message.deleteSent, [req.user.id, req.params.id]);
      if (rowCount === 0) {
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
export default Message;
