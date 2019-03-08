import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const Auth = {
  verifyToken(req, res, next) {
    const token = req.headers['access-token'];
    if (!token) { res.status(400).json({ status: 401, error: 'No Authentication Token Provided.' }); return; }

    try {
      const decoded = jwt.verify(token, process.env.SECRETKEY);
      req.user = { id: decoded.userId };
      next();
    } catch (e) {
      res.status(400).json({ status: 400, error: `There was an error processing your request. ${e}` });
    }
  },
};

export default Auth;
