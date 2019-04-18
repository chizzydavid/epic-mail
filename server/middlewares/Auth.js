import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../db';
import { message, group } from '../db/queries';

dotenv.config();

const Auth = {
  verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        status: 401,
        error: 'No Authentication Token Provided.',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRETKEY);
      req.user = { id: decoded.userId };
      next();
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error processing your request. ${e}`,
      });
    }
  },

  async verifyMessage(req, res, next) {
    try {
      const { rows } = await db.query(message.verifyQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Message not found.',
        });
      }
      // if rows contains more than one object then the message was sent to a group
      // confirm if user was a member of the group that received the message
      if (rows.length > 1) {
        const authorized = 
          rows.some(messg => messg.receiver_id === req.user.id || messg.sender_id === req.user.id);

          if (!authorized) {
          return res.status(400).json({
            status: 400,
            error: 'Unauthorized access.',
          });
        }
      } else if (req.user.id !== rows[0].sender_id && req.user.id !== rows[0].receiver_id) {
        return res.status(400).json({
          status: 400,
          error: 'Unauthorized access.',
        });
      }
      next();
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error verifying this Message. ${e}`,
      });
    }
  },

  async verifyGroup(req, res, next) {
    try {
      const { rows } = await db.query(group.selectByGroupId, [req.params.groupId]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Group not found.',
        });
      }
      if (req.user.id !== rows[0].owner_id) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access.',
        });
      }
      next();
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `There was an error verifying group. ${e}`,
      });
    }
  },
};

export default Auth;
