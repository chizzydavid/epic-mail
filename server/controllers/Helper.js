import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const Helper = {
  generateToken(id) {
    return jwt.sign({ userId: id }, process.env.SECRETKEY);
  },
};

export default Helper;
