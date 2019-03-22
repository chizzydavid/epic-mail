import db from '../db';

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
};

export default Group;
