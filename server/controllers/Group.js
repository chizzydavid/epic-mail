import db from '../db';
import moment from 'moment';

const Group = {
  async createGroup(req, res) {
    let owner_id = req.user.id;
    const query = `INSERT INTO
      groups(name, description, owner_id)
      VALUES($1, $2, $3) returning *`;

    const values = [
      req.body.name,
      req.body.description || '',
      owner_id,
    ];

    try {
      const { rows } = await db.query(query, values);
      return res.status(201).json({ status: 201, data: [rows[0]] });
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error adding your new group to the database. ${e}` });
    }
  },

  async getAllUserGroups(req, res) {
    const query = 'SELECT * FROM groups WHERE owner_id = $1';
    try {
      const { rows, rowCount } = await db.query(query, [req.user.id]);
      return res.status(200).json({ status: 200, data: [ {rowCount}, [...rows] ] });
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error getting all your groups. ${e}` });
    }
  },

  async editGroupName(req, res) {
    const query = 'SELECT * FROM groups WHERE group_id = $1';
    try {
      const { rows } = await db.query(query, [req.params.groupId]);
      if (!rows[0]) {
        return res.status(409).json({status: 404, error: 'Group not found.'});
      }
      const { owner_id } = rows[0];
      if (req.user.id !== owner_id) {
        return res.status(401).json({status: 401, error: 'Unauthorized access.'});
      }
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error editing your groups name. ${e}` });
    }    

    try {
      const updateQuery = `UPDATE groups SET name=$1 WHERE group_id=$2 returning *`;
      const { rows } = await db.query(updateQuery, [req.params.name, req.params.groupId]);
      return res.status(200).json({ status: 200, data: [rows[0]] });
     
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error editing your groups name. ${e}` });
    }
  },

  async addUserToGroup(req, res) {
    const query = 'SELECT owner_id FROM groups WHERE group_id = $1';
    try {
      const { rows } = await db.query(query, [req.params.groupId]);
      if (!rows[0]) {
        return res.status(404).json({status: 404, error: 'Group not found'});
      }
      if (rows[0].owner_id !== req.user.id) 
         return res.status(400).json({status: 400, error: 'Unauthorized access.'});
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error authenticating user. ${e}` });
    }

    try {
      let valueString = '';
      const users = req.body.users;

      users.forEach((user, idx) => {
        valueString += `('${req.params.groupId}', '${user}', 'member')${idx === users.length - 1 ? '' : ','}`;
      })
      const createQuery = `INSERT INTO group_users(group_id, user_id, user_role)
          VALUES ${valueString} returning *`
      const { rows } = await db.query(createQuery);
      return res.status(201).json({ status: 201, data: [...rows] });   
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error adding new users to your group. ${e}` });
    }
  },

  async deleteUserFromGroup(req, res) {
    const query = 'SELECT owner_id FROM groups WHERE group_id = $1';
    try {
      const { rows } = await db.query(query, [req.params.groupId]);
      if (!rows[0]) {
        return res.status(404).json({status: 404, error: 'Group not found.'});
      }
      if (rows[0].owner_id !== req.user.id) 
         return res.status(400).json({status: 400, error: 'Unauthorized access.'});
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error authenticating user. ${e}` });
    }

    try {
      const query = 'SELECT * FROM group_users WHERE group_id = $1 AND user_id = $2';
      const { rowCount } = await db.query(query, [req.params.groupId, req.params.id]);
      if (rowCount < 1) {
        return res.status(404).json({status: 404, error: 'User is not a member of this group.'});
      }

      const deleteQuery = `DELETE FROM group_users WHERE group_id = $1 AND user_id = $2`;
      const { rows } = await db.query(deleteQuery, [req.params.groupId, req.params.id]);
      if (!rows[0]) {
        return res.status(200).json({ status: 200, message: `User deleted successfully.` });
      }
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error deleting this user from your group. ${e}` });
    }
  },



  async sendMessageToGroup(req, res) {
    let inboxString = '';
    let members;
    try {
      const query = 'SELECT * FROM groups WHERE group_id = $1';
      const { rows } = await db.query(query, [req.params.groupId]);
      if (!rows[0]) {
        return res.status(404).json({status: 404, error: 'Group not found'});
      }
      if (rows[0].owner_id !== req.user.id) {
        return res.status(400).json({status: 400, error: 'Unauthorized access.'});
      }
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error authenticating user. ${e}` });
    }

    try {
      const query = 'SELECT user_id FROM group_users WHERE group_id=$1';
      const { rows } = await db.query(query, [req.params.groupId]);
      members = rows;

      if (rows.length === 0) {
        return res.status(400).json({ status: 400, message: 'There are no group members for this group.' });
      }
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error getting the members of this group. ${e}` });
    }

    try {
      const query = `INSERT INTO
        messages(created_at, subject, message, sender_id, receiver_id, parent_msg_id, status )
        VALUES($1, $2, $3, $4, $5, $6, $7) returning *`;

      const values = [
        moment().format('MMMM Do YYYY, h:mm:ss a'),
        req.body.subject,
        req.body.message,
        req.user.id,
        0,
        req.body.parentMessageId || 0,
        'sent'
      ];

      const { rows } = await db.query(query, values);
      const { message_id, receiver_id, sender_id } = rows[0];
      console.log(rows);

      members.forEach((user, idx) => {
        console.log(user);
        inboxString += `(${user.user_id}, ${message_id})${idx === members.length - 1 ? '' : ','}`;
      })
      console.log(inboxString);
      const inboxQuery = `INSERT INTO inbox (receiver_id, message_id) VALUES ${inboxString}`;
      const outboxQuery = `INSERT INTO outbox (sender_id, message_id) VALUES (${sender_id}, ${message_id})`;

      await db.query(inboxQuery);
      await db.query(outboxQuery);

      return res.status(201).json({ status: 201, data: [rows[0]] });

    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error sending your message. ${e}` });
    }
  }

};

export default Group;
