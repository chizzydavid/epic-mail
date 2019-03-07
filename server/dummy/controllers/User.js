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

  loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) { return res.status(400).json({ status: 400, error: 'All fields are required.' }); }

    const userLogin = UserModel.login({ email, password });
    if (userLogin.message === 'User not found') { return res.status(404).json({ status: 404, error: 'User not found.' }); }

    if (userLogin.message === 'Invalid password') { return res.status(400).json({ status: 400, error: 'Invalid password.' }); }

    return res.status(200).json({ status: 200, data: { ...userLogin } });
  },

  getAllUsers(req, res) {
    const users = UserModel.findAll();
    return res.status(200).json({ status: 200, data: [...users] });
  },


  getUser(req, res) {
    const user = UserModel.findUser(Number(req.params.id));
    if (!user) { return res.status(404).json({ status: 404, error: 'User not found.' }); }

    return res.status(200).json({ status: 200, data: { ...user } });
  },

  updateUser(req, res) {
    const user = UserModel.findUser(Number(req.params.id));
    if (!user) { return res.status(404).json({ status: 404, error: 'User not found.' }); }

    const updatedUser = UserModel.update(req.params.id, req.body);
    return res.status(201).json({ status: 201, data: { ...updatedUser } });
  },

  deleteUser(req, res) {
    const user = UserModel.findUser(Number(req.params.id));
    if (!user) { return res.status(404).json({ status: 404, error: 'User not found.' }); }

    const ref = UserModel.delete(req.params.id);
    return res.status(204).send(ref);
  },


};

export default User;
