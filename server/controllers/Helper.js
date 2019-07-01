import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();
const Helper = {
  generateToken(user) {
    return jwt.sign({ user }, process.env.SECRETKEY, { expiresIn: '7d' });
  },

  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },

  comparePassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  },
};


export default Helper;
