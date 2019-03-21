import db from '../db';

const Message = {
  async sendMessage(req, res) {
    const getReceiver = 'SELECT user_id FROM users WHERE email = $1';
    let receiver_id;
    try {
      const { rows } = await db.query(getReceiver, [req.body.receiver]);
      if(!rows[0])
        return res.status(404).json({status: 404, error: 'Message Recipient doesn\'t exist on the db.'});  
      receiver_id = rows[0].user_id;

    } catch(e) { 
      return res.status(400).json({ status: 400, error: `There was an error sending your message. ${e}` });
    }

    const query = `INSERT INTO
      messages(created_at, subject, message, sender_id, receiver_id, parent_msg_id, status )
      VALUES($1, $2, $3, $4, $5, $6, $7) returning *`;

    const values = [
      Date.now(),
      req.body.subject,
      req.body.message,
      req.user.id,
      receiver_id,
      req.body.parentMessageId || 0,
      'sent',
    ];
    try {
      const { rows } = await db.query(query, values);
      const { message_id, receiver_id, sender_id } = rows[0];

      const inboxQuery = `INSERT INTO inbox (receiver_id, message_id) VALUES (${receiver_id}, ${message_id})`;
      const sentQuery = `INSERT INTO outbox (sender_id, message_id) VALUES (${sender_id}, ${message_id})`;

      await db.query(inboxQuery);
      await db.query(sentQuery);

      return res.status(201).json({ status: 201, data: [rows[0]] });
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error sending your message. ${e}` });
    }
  },

  async getAllReceived(req, res) {
    const query = `SELECT DISTINCT I.receiver_id, M.message_id, M.subject, M.message, M.parent_msg_id, M.status, M.created_at 
      FROM inbox I INNER JOIN messages M USING(receiver_id) WHERE receiver_id = $1`;

    try {
      const { rows, rowCount } = await db.query(query, [req.user.id]);
      return res.status(200).json({ status: 200, data: [ {rowCount}, [...rows] ] });
    } catch(e) {
      return res.status(400).json({ status: 400, error:`There was an error getting all your received messages. ${e}`});
    }
  },

  async getAllUnread(req, res) {
    const query = `SELECT DISTINCT I.receiver_id, M.message_id, M.subject, M.message, M.parent_msg_id, M.status, M.created_at 
      FROM inbox I INNER JOIN messages M USING(receiver_id) WHERE receiver_id = $1 AND status=$2`;

    try {
      const { rows, rowCount } = await db.query(query, [req.user.id, "unread"]); 
      return res.status(200).json({ status: 200, data: [ {rowCount}, [...rows] ] });
    } catch(error) {
      return res.status(400).json({ status: 400, error: 'There was an error getting your unread messages.' });
    }
  },

  async getAllSent(req, res) {
    const query = `SELECT DISTINCT S.sender_id, M.message_id, M.subject, M.message, M.parent_msg_id, M.status, M.created_at 
      FROM outbox S INNER JOIN messages M USING(sender_id) WHERE sender_id = $1`;

    try {
      const { rows, rowCount } = await db.query(query, [req.user.id]);
      return res.status(200).json({ status: 200, data: [ {rowCount}, [...rows] ] });
    } catch(e) {
      return res.status(400).json({ status: 400, error:`There was an error getting your sent messages. ${e}` });
    }
  },

  async getSingleMessage(req, res) {
    const query = 'SELECT * FROM messages WHERE message_id =$1';
    try {
      const { rows } = await db.query(query, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({status: 404, error: 'Message not found'});
      }
      const { sender_id, receiver_id } = rows[0];
      if (req.user.id == sender_id || req.user.id == receiver_id) {
        return res.status(200).json({ status: 200, data: [rows[0]] });
      } else {
        return res.status(400).json({status: 400, error: 'Unauthorized access.'});
      }
      
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error retrieving this Message. ${e}` });
    }
  },

  async deleteReceivedMessage(req, res) {
    const query = 'SELECT * FROM messages WHERE message_id =$1';
    try {
      const { rows } = await db.query(query, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({status: 404, error: 'Message not found'});
      }
      const { receiver_id } = rows[0];
      if (req.user.id == receiver_id) {
        const query = 'DELETE FROM inbox WHERE receiver_id = $1 AND message_id = $2';
 
        let { rowCount } = await db.query(query, [receiver_id, req.params.id]);
        if (rowCount == 0) {
            return res.status(200).json({status: 200, message: 'Message successfully deleted.'});          
        }
      } else {
        return res.status(400).json({status: 400, error: 'Unauthorized access.'});
      }
      
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error deleting this Message. ${e}` });
    }
  }

};
export default Message;
