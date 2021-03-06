"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _db = _interopRequireDefault(require("../db"));

var _queries = require("../db/queries");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Group = {
  async createGroup(req, res) {
    const values = [req.values.name, req.values.description || '', req.user.user_id];
    const {
      members
    } = req.body;

    try {
      const {
        rows
      } = await _db.default.query(_queries.group.insert, values);
      const groupId = rows[0].group_id;

      if (members.length !== 0) {
        let memberString = '';
        members.forEach((user, idx) => {
          memberString += `('${groupId}', '${user}', 'member')${idx === members.length - 1 ? '' : ','}`;
        });
        await _db.default.query(`INSERT INTO group_users(group_id, user_id, user_role) VALUES ${memberString} returning *`);
      }

      return res.status(201).json({
        status: 201,
        data: rows[0]
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error creating your group. ${e}`
      });
    }
  },

  async getAllUserGroups(req, res) {
    try {
      const {
        rows,
        rowCount
      } = await _db.default.query(_queries.group.selectByOwner, [req.user.user_id]);

      if (rowCount === 0) {
        return res.status(200).json({
          status: 200,
          message: 'You have no groups.'
        });
      }

      return res.status(200).json({
        status: 200,
        data: [...rows]
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error getting all your groups. ${e}`
      });
    }
  },

  async editGroup(req, res) {
    try {
      const values = [req.values.name, req.values.description || '', req.params.groupId];
      const {
        rows
      } = await _db.default.query(_queries.group.updateGroup, values);
      return res.status(200).json({
        status: 200,
        data: rows[0]
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error editing this group. ${e}`
      });
    }
  },

  async addUserToGroup(req, res) {
    try {
      await _db.default.query(_queries.group.deleteGroupUsers, [req.params.groupId]);
      let memberString = '';
      const {
        members
      } = req.body;
      members.forEach((member, idx) => {
        memberString += `('${req.params.groupId}', '${member}', 'member')${idx === members.length - 1 ? '' : ','}`;
      });
      const {
        rows
      } = await _db.default.query(`INSERT INTO group_users(group_id, user_id, user_role) VALUES ${memberString} returning *`);
      return res.status(201).json({
        status: 201,
        data: [...rows]
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error adding new users to your group. ${e}`
      });
    }
  },

  async deleteUserFromGroup(req, res) {
    try {
      const {
        rowCount
      } = await _db.default.query(_queries.group.selectUser, [req.params.groupId, req.params.id]);

      if (rowCount === 0) {
        return res.status(404).json({
          status: 404,
          error: 'User is not a member of this group.'
        });
      }

      const {
        rows
      } = await _db.default.query(_queries.group.deleteUser, [req.params.groupId, req.params.id]);

      if (!rows[0]) {
        return res.status(200).json({
          status: 200,
          message: 'User deleted successfully.'
        });
      }
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error deleting this user from your group. ${e}`
      });
    }
  },

  async sendMessageToGroup(req, res) {
    let inboxString = '';
    let members;

    try {
      const result = await _db.default.query(_queries.group.selectGroupMembers, [req.params.groupId]);
      members = result.rows;

      if (!members.length) {
        return res.status(200).json({
          status: 200,
          message: 'There are no group members for this group.'
        });
      }

      const values = [(0, _moment.default)().format('MMMM Do YYYY, h:mm:ss a'), req.values.subject, req.values.message, req.user.user_id, 0, req.values.parentMessageId || 0, 'sent'];
      const {
        rows
      } = await _db.default.query(_queries.message.insert, values);
      const {
        message_id,
        sender_id
      } = rows[0];
      members.forEach((user, idx) => {
        inboxString += `(${user.user_id}, ${message_id})${idx === members.length - 1 ? '' : ','}`;
      });
      await _db.default.query(`INSERT INTO inbox (receiver_id, message_id) VALUES ${inboxString}`);
      await _db.default.query(`INSERT INTO outbox (sender_id, message_id) VALUES (${sender_id}, ${message_id})`);
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

  async getSingleGroup(req, res) {
    try {
      // get group details
      const {
        rows
      } = await _db.default.query(_queries.group.selectByGroupId, [req.params.groupId]); // get group members

      const result = await _db.default.query(_queries.group.selectGroupMembers, [req.params.groupId]);
      return res.status(200).json({
        status: 200,
        data: [rows[0], result.rows]
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error retrieving this group. ${e}`
      });
    }
  },

  async deleteGroup(req, res) {
    try {
      await _db.default.query(_queries.group.deleteGroup, [req.params.groupId]);
      await _db.default.query(_queries.group.deleteGroupUsers, [req.params.groupId]);
      return res.status(200).json({
        status: 200,
        message: 'Group deleted successfully.'
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error deleting your group. ${e}`
      });
    }
  }

};
var _default = Group;
exports.default = _default;
//# sourceMappingURL=Group.js.map