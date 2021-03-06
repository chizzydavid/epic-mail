import Helper from './Helper';
import db from '../db';
import { user } from '../db/queries';

const User = {
  async createUser(req, res) {
    try {
      const hashPassword = Helper.hashPassword(req.values.password);
      const imgName = req.file ? req.file.filename : 'default-user.png';
      const values = [
        req.values.email,
        req.values.firstName,
        req.values.lastName,
        hashPassword,
        req.values.is_admin || 0,
        imgName,
      ];

      const { rows } = await db.query(user.insert, values);
      if (rows[0].user_id) {
        const {
          user_id, email, first_name, last_name, photo,
        } = rows[0];

        const userData = {
          user_id, email, first_name, last_name, photo,
        };

        const token = Helper.generateToken({ ...userData });
        return res.status(201).json({
          status: 201,
          message: 'User successfully registered',
          data: { token, user: userData },
        });
      }
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `An error occured while creating your account. ${e}`,
      });
    }
  },

  async loginUser(req, res) {
    try {
      const { rows } = await db.query(user.selectByEmail, [req.values.email]);
      if (!rows[0]) {
        return res.status(400).json({
          status: 400,
          error: 'Invalid Login Credentials.',
        });
      }
      if (!Helper.comparePassword(req.values.password, rows[0].password)) {
        return res.status(400).json({
          status: 400,
          error: 'Invalid Login Credentials.',
        });
      }
      const {
        user_id, email, first_name, last_name, photo,
      } = rows[0];

      const userData = {
        user_id, email, first_name, last_name, photo,
      };

      const token = Helper.generateToken({ ...userData });
      return res.status(200).json({
        status: 200,
        data: { token, user: userData },
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `An error occured while trying to log you in. ${e}`,
      });
    }
  },

  async getAllUsers(req, res) {
    try {
      const { rows } = await db.query(user.selectAll);
      return res.status(200).json({
        status: 200,
        data: [...rows],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error getting all users. ${e}`,
      });
    }
  },

  async getSingleUser(req, res) {
    try {
      const { rows } = await db.query(user.selectById, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'User not found.',
        });
      }
      return res.status(200).json({
        status: 200,
        data: rows[0],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error retrieving this User. ${e}`,
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const { rowCount } = await db.query(user.selectById, [req.params.id]);
      if (!rowCount) {
        return res.status(404).json({
          status: 404,
          error: 'User not found.',
        });
      }
      const { rows } = await db.query(user.delete, [req.params.id]);
      if (!rows[0]) {
        return res.status(200).json({
          status: 200,
          message: 'User successfully deleted.',
        });
      }
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error deleting this User. ${e}`,
      });
    }
  },
};

export default User;
