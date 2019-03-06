import UserModel from '../models/User';

const User = {
  createUser(req, res) {
    const {
      id, email, firstName, lastName, password,
    } = req.body;
    if (!id || !email || !firstName || !lastName || !password) return res.status(400).json({ status: 400, error: 'All fields are required.' });

    const newUser = UserModel.create(req.body);
    return res.status(201).json({ status: 201, data: { ...newUser } });
  },


};

export default User;
