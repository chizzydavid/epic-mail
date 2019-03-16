import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModel from '../dummy/models/User';

dotenv.config();

const Auth = {
  verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) { res.status(400).json({ status: 400, error: 'No Authentication Token Provided.' }); return; }

    try {
      const decoded = jwt.verify(token, process.env.SECRETKEY);
      req.user = { id: decoded.userId };
      const user = UserModel.findUser(req.user.id);
      if (!user) {return res.status(404).json({ status: 404,  error: 'Invalid Token.' });}

      next();
    } catch (e) {
      res.status(400).json({ status: 400, error: `There was an error processing your request. ${e}` });
    }
  },
};

export default Auth;
