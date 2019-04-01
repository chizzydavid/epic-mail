const user = {
	insert: `INSERT INTO users (email, first_name, last_name, password, is_admin, photo) VALUES($1, $2, $3, $4, $5, $6) returning *`,
	selectAll: `SELECT * FROM users`,
	selectByEmail: `SELECT * FROM users WHERE email = $1`,
	selectById: `SELECT * FROM users WHERE user_id = $1`,
	delete: `DELETE FROM users WHERE user_id = $1`
}

const message = {
	insert: `INSERT INTO messages(created_at, subject, message, sender_id, receiver_id, parent_msg_id, status )
		VALUES($1, $2, $3, $4, $5, $6, $7) returning *`,

	selectAllReceived: `SELECT DISTINCT I.receiver_id, M.message_id, M.subject, M.message, M.parent_msg_id, M.status, M.created_at 
		FROM inbox I INNER JOIN messages M USING(receiver_id) WHERE receiver_id = $1 AND I.message_id=M.message_id`,

	selectAllUnread: `SELECT DISTINCT I.receiver_id, M.message_id, M.subject, M.message, M.parent_msg_id, M.status, M.created_at 
		FROM inbox I INNER JOIN messages M USING(receiver_id) WHERE receiver_id = $1 AND status=$2`,
	
	selectAllSent: `SELECT DISTINCT O.sender_id, M.message_id, M.subject, M.message, M.parent_msg_id, M.status, M.created_at 
		FROM outbox O INNER JOIN messages M USING(sender_id) WHERE sender_id = $1 AND O.message_id=M.message_id`,

	inboxQuery: `INSERT INTO inbox (receiver_id, message_id) VALUES ($1, $2)`,
	sentQuery: `INSERT INTO outbox (sender_id, message_id) VALUES ($1, $2)`,
	selectById: `SELECT * FROM messages WHERE message_id =$1`,
	selectUser: `SELECT user_id FROM users WHERE email = $1`,
	deleteReceived: `DELETE FROM inbox WHERE receiver_id = $1 AND message_id = $2`,
	deleteSent: `DELETE FROM outbox WHERE sender_id = $1 AND message_id = $2`
	
}

const group = {
	insert: `INSERT INTO groups(name, description, owner_id) VALUES($1, $2, $3) returning *`,
	updateName: `UPDATE groups SET name=$1 WHERE group_id=$2 returning *`,
	selectUser: `SELECT * FROM group_users WHERE group_id = $1 AND user_id = $2`,
	selectGroupMembers: `SELECT user_id FROM group_users WHERE group_id=$1`,
	selectByGroupId: `SELECT * FROM groups WHERE group_id = $1`,
	selectByOwner: `SELECT * FROM groups WHERE owner_id = $1`,
	deleteUser: `DELETE FROM group_users WHERE group_id = $1 AND user_id = $2`,
	deleteGroupUsers: `DELETE FROM group_users WHERE group_id=$1`,
	deleteGroup: `DELETE FROM groups WHERE group_id=$1`
}

export { user, message, group }