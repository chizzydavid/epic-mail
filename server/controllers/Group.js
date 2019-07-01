import moment from 'moment';
import db from '../db';
import { message, group } from '../db/queries';

const Group = {
  async createGroup(req, res) {
    const values = [req.values.name, req.values.description || '', req.user.id];
    const { members } = req.body;
    try {
      const { rows } = await db.query(group.insert, values);
      const groupId = rows[0].group_id;

      if (members.length !== 0) {
        let memberString = '';
        members.forEach((user, idx) => {
          memberString += `('${groupId}', '${user}', 'member')${idx === members.length - 1 ? '' : ','}`;
        });
        await db.query(`INSERT INTO group_users(group_id, user_id, user_role) VALUES ${memberString} returning *`);
      }
      return res.status(201).json({
        status: 201,
        data: rows[0],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error creating your group. ${e}`,
      });
    }
  },

  async getAllUserGroups(req, res) {
    try {
      const { rows, rowCount } = await db.query(group.selectByOwner, [req.user.id]);
      if (rowCount === 0) {
        return res.status(200).json({
          status: 200,
          message: 'You have no groups.',
        });
      }
      return res.status(200).json({
        status: 200,
        data: [...rows],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error getting all your groups. ${e}`,
      });
    }
  },

  async editGroup(req, res) {
    try {
      const values = [
        req.values.name,
        req.values.description || '',
        req.params.groupId,
      ];
      const { rows } = await db.query(group.updateGroup, values);
      return res.status(200).json({
        status: 200,
        data: rows[0],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error editing this group. ${e}`,
      });
    }
  },

  async addUserToGroup(req, res) {
    try {
      await db.query(group.deleteGroupUsers, [req.params.groupId]);

      let memberString = '';
      const { members } = req.body;
      members.forEach((member, idx) => {
        memberString += `('${req.params.groupId}', '${member}', 'member')${idx === members.length - 1 ? '' : ','}`;
      });

      const { rows } = await db.query(`INSERT INTO group_users(group_id, user_id, user_role) VALUES ${memberString} returning *`);
      return res.status(201).json({
        status: 201,
        data: [...rows],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error adding new users to your group. ${e}`,
      });
    }
  },

  async deleteUserFromGroup(req, res) {
    try {
      const { rowCount } = await db.query(group.selectUser, [req.params.groupId, req.params.id]);
      if (rowCount === 0) {
        return res.status(404).json({
          status: 404,
          error: 'User is not a member of this group.',
        });
      }
      const { rows } = await db.query(group.deleteUser, [req.params.groupId, req.params.id]);
      if (!rows[0]) {
        return res.status(200).json({
          status: 200,
          message: 'User deleted successfully.',
        });
      }
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error deleting this user from your group. ${e}`,
      });
    }
  },

  async sendMessageToGroup(req, res) {
    let inboxString = '';
    let members;
    try {
      const result = await db.query(group.selectGroupMembers, [req.params.groupId]);
      members = result.rows;

      if (!members.length) {
        return res.status(200).json({
          status: 200,
          message: 'There are no group members for this group.',
        });
      }

      const values = [
        moment().format('MMMM Do YYYY, h:mm:ss a'),
        req.values.subject,
        req.values.message,
        req.user.id,
        0,
        req.values.parentMessageId || 0,
        'sent',
      ];

      const { rows } = await db.query(message.insert, values);
      const { message_id, sender_id } = rows[0];

      members.forEach((user, idx) => {
        inboxString += `(${user.user_id}, ${message_id})${idx === members.length - 1 ? '' : ','}`;
      });

      await db.query(`INSERT INTO inbox (receiver_id, message_id) VALUES ${inboxString}`);
      await db.query(`INSERT INTO outbox (sender_id, message_id) VALUES (${sender_id}, ${message_id})`);

      return res.status(201).json({
        status: 201,
        data: rows[0],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error sending your message. ${e}`,
      });
    }
  },

  async getSingleGroup(req, res) {
    try {
      // get group details
      const { rows } = await db.query(group.selectByGroupId, [req.params.groupId]);
      // get group members
      const result = await db.query(group.selectGroupMembers, [req.params.groupId]);

      return res.status(200).json({
        status: 200,
        data: [rows[0], result.rows],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error retrieving this group. ${e}`,
      });
    }
  },

  async deleteGroup(req, res) {
    try {
      await db.query(group.deleteGroup, [req.params.groupId]);
      await db.query(group.deleteGroupUsers, [req.params.groupId]);
      return res.status(200).json({
        status: 200,
        message: 'Group deleted successfully.',
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error deleting your group. ${e}`,
      });
    }
  },

};
export default Group;
