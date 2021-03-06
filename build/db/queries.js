"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.group = exports.message = exports.user = void 0;
const user = {
  insert: 'INSERT INTO users (email, first_name, last_name, password, is_admin, photo) VALUES($1, $2, $3, $4, $5, $6) returning *',
  selectAll: 'SELECT * FROM users',
  selectByEmail: 'SELECT * FROM users WHERE email = $1',
  selectById: 'SELECT * FROM users WHERE user_id = $1',
  delete: 'DELETE FROM users WHERE user_id = $1'
};
exports.user = user;
const message = {
  insert: `INSERT INTO messages(created_at, subject, message, sender_id, receiver_id, parent_msg_id, status )
		VALUES($1, $2, $3, $4, $5, $6, $7) returning *`,
  updateStatusUnread: 'UPDATE messages SET status=\'unread\' WHERE receiver_id = $1 AND status = \'sent\'',
  updateStatusRead: 'UPDATE messages SET status=\'read\' WHERE receiver_id = $1 AND message_id = $2',
  updateStatusDraft: 'UPDATE messages SET status=\'draft\' WHERE message_id = $1',
  selectAllReceived: `SELECT DISTINCT I.receiver_id, M.message_id, M.sender_id, M.subject, M.message, M.parent_msg_id, M.status, M.created_at, U.photo
		FROM inbox I 
    INNER JOIN messages M USING(message_id) 
    INNER JOIN users U ON (M.sender_id = U.user_id) 
    WHERE I.receiver_id = $1 AND I.receiver_id != M.sender_id ORDER BY M.message_id DESC`,
  selectAllCategory: `SELECT DISTINCT I.receiver_id, M.message_id, M.sender_id, M.subject, M.message, M.parent_msg_id, M.status, M.created_at, U.photo
    FROM inbox I
    INNER JOIN messages M USING(receiver_id)
    INNER JOIN users U ON (M.sender_id = U.user_id) 
    WHERE receiver_id = $1 AND status=$2 AND I.message_id=M.message_id ORDER BY M.message_id DESC`,
  selectAllDrafts: `SELECT DISTINCT O.sender_id, M.message_id, M.subject, M.message, M.receiver_id, M.status, U.email
		FROM outbox O 
		INNER JOIN messages M USING(sender_id) 
		FULL OUTER JOIN users U ON(M.receiver_id = U.user_id) 
		WHERE sender_id = $1 AND status=$2 AND O.message_id=M.message_id ORDER BY M.message_id DESC`,
  selectAllSent: `SELECT DISTINCT O.sender_id, M.message_id, M.subject, M.message, M.parent_msg_id, M.status, M.created_at, U.photo
		FROM outbox O 
		INNER JOIN messages M USING(sender_id)
    INNER JOIN users U ON (M.sender_id = U.user_id)
    WHERE sender_id = $1 AND O.message_id=M.message_id AND status != 'draft' ORDER BY M.message_id DESC`,
  inboxQuery: 'INSERT INTO inbox (receiver_id, message_id) VALUES ($1, $2)',
  sentQuery: 'INSERT INTO outbox (sender_id, message_id) VALUES ($1, $2)',
  selectById: 'SELECT * FROM messages WHERE message_id =$1',
  selectByIdJoinUser: `SELECT M.message_id, M.sender_id, M.subject, M.message, M.parent_msg_id, M.status, M.created_at, U.email, U.first_name, U.last_name 
		FROM messages M 
		INNER JOIN users U ON M.sender_id = U.user_id AND message_id = $1`,
  selectReceiver: 'SELECT receiver_id FROM messages WHERE message_id =$1',
  selectUser: 'SELECT user_id FROM users WHERE email = $1',
  deleteReceived: 'DELETE FROM inbox WHERE receiver_id = $1 AND message_id = $2',
  deleteAllReceived: 'DELETE FROM inbox WHERE message_id = $1',
  deleteSent: 'DELETE FROM outbox WHERE sender_id = $1 AND message_id = $2',
  verifyQuery: `SELECT M.message_id, O.sender_id, I.receiver_id FROM messages M 
    FULL OUTER JOIN outbox O ON(M.message_id=O.message_id) 
    FULL OUTER JOIN inbox I ON(M.message_id=I.message_id) WHERE M.message_id=$1`
};
exports.message = message;
const group = {
  insert: 'INSERT INTO groups(name, description, owner_id) VALUES($1, $2, $3) returning *',
  updateGroup: 'UPDATE groups SET name=$1, description=$2 WHERE group_id=$3 returning *',
  selectUser: 'SELECT * FROM group_users WHERE group_id = $1 AND user_id = $2',
  selectGroupMembers: `SELECT DISTINCT G.user_id, U.email, U.first_name, U.last_name 
		FROM group_users G 
    INNER JOIN users U USING(user_id) WHERE G.group_id = $1`,
  selectByGroupId: 'SELECT * FROM groups WHERE group_id = $1',
  selectByOwner: 'SELECT * FROM groups WHERE owner_id = $1',
  deleteUser: 'DELETE FROM group_users WHERE group_id = $1 AND user_id = $2',
  deleteGroupUsers: 'DELETE FROM group_users WHERE group_id=$1',
  deleteGroup: 'DELETE FROM groups WHERE group_id=$1'
};
exports.group = group;
//# sourceMappingURL=queries.js.map