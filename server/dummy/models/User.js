import Helper from '../controllers/Helper';

class User {
  constructor() {
    this.users = [];
  }

  create(user) {
    const token = Helper.generateToken(user.id);
    const newUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      isAdmin: user.isAdmin,
      token,
    };
    this.users.push(newUser);
    return { message: 'New user created successfully.', user: newUser };
  }
}

export default new User();
