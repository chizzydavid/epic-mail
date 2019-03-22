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



};

export default Group;
