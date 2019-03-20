import Helper from './Helper';
import db from '../db';

const User = {
  async createUser(req, res) {

    const query = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows, rowCount } = await db.query(query, [req.body.email]);
      if (rows[0]) 
        return res.status(400).json({ status: 400, message: `This email has already been registered.` });
    } catch(e) {
      return res.status(400).json({ status: 400, error: `An error occured while creating your account. ${e}` });      
    }
    const hashPassword = Helper.hashPassword(req.body.passwordOne);

    const queryInsert = `INSERT INTO
      users (email, first_name, last_name, password, is_admin)
      VALUES($1, $2, $3, $4, $5)
      returning *`;

    const values = [
      req.body.email,
      req.body.firstName,
      req.body.lastName,
      hashPassword,
      req.body.is_admin || 0
    ];

    try {
      const { rows } = await db.query(queryInsert, values);
      const token = Helper.generateToken(rows[0].user_id);
      return res.status(201).json({ status: 201, data:[{token}] });
    } catch(e) {
      return res.status(400).json({ status: 400, error: `An error occured while creating your account. ${e}` });
    }
  },

  async loginUser(req, res) {
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await db.query(query, [req.body.email]);
      if (!rows[0]) {
        return res.status(400).json({ status: 400, error: 'Invalid Login Credentials.'})
      }
      if (!Helper.comparePassword(req.body.password, rows[0].password)) {
        return res.status(400).json({ status: 400, error: 'Invalid Login Credentials.'})
      }
      const token = Helper.generateToken(rows[0].user_id);
      return res.status(200).json({ status: 200, data:[{token}] });
    } catch(error) {
      return res.status(400).json({ status: 400, error: `An error occured while trying to log you in. ${e}` });
    }
  },


  async getAllUsers(req, res) {
    const query = 'SELECT * FROM users';
    try {
      const { rows, rowCount } = await db.query(query);
      return res.status(200).json({ status: 200, data: [ {rowCount}, [...rows] ] });
    } catch(e) {
      return res.status(400).json({ status: 400, error: `There was an error getting all users. ${e}` });
    }
  },

};

export default User;
