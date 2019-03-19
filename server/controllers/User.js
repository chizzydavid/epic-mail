import db from '../db';

const User = {
  createUser(req, res) {
    const result = UserModel.create(req.body);
    if (result.message === 'This email is already registered.') { return res.status(400).json({ status: 400, data: { ...result } }); }
    return res.status(201).json({ status: 201, data: { ...result } });
  },

  loginUser(req, res) {
    const { email, password } = req.body;

    const userLogin = UserModel.login({ email, password });
    if (userLogin.message === 'User not found') { return res.status(404).json({ status: 404, error: 'Invalid Login Credentials.' }); }

    if (userLogin.message === 'Invalid password') { return res.status(400).json({ status: 400, error: 'Invalid Login Credentials.' }); }

    return res.status(200).json({ status: 200, data: { ...userLogin } });
  },

  getAllUsers(req, res) {
    const users = UserModel.findAll();
    return res.status(200).json({ status: 200, data: [...users] });
  },


  getUser(req, res) {
    if (req.body.id != req.params.id) { return res.status(400).json({ status: 400, error: 'Unauthorized access.' }); }

    const user = UserModel.findUser(Number(req.params.id));
    if (!user) { return res.status(404).json({ status: 404, error: 'User not found.' }); }
    return res.status(200).json({ status: 200, data: { ...user } });
  },

  updateUser(req, res) {
    if (req.body.id != req.params.id) { return res.status(400).json({ status: 400, error: 'Unauthorized access.' }); }

    const user = UserModel.findUser(Number(req.params.id));
    if (!user) { return res.status(404).json({ status: 404, error: 'User not found.' }); }

    const updatedUser = UserModel.update(req.params.id, req.body);
    return res.status(200).json({ status: 200, data: { ...updatedUser } });
  },

  deleteUser(req, res) {
    if (req.body.id != req.params.id) { return res.status(400).json({ status: 400, error: 'Unauthorized access.' }); }
    const user = UserModel.findUser(Number(req.params.id));
    if (!user) { return res.status(404).json({ status: 404, error: 'User not found.' }); }

    const ref = UserModel.delete(req.params.id);
    return res.status(200).json({ status: 200, message: 'User successfully deleted.' });
  },

};

export default User;
