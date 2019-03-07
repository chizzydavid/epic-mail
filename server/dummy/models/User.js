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

  
  login(user) {
    const foundUser = this.users.find(dbuser => dbuser.email === user.email);
    if (!foundUser) { return { message: 'User not found' }; }

    if (foundUser.password !== user.password) { return { message: 'Invalid password' }; }

    return { message: 'User login successful', user: foundUser };
  }

  findAll() {
    return this.users;
  }

  findUser(id) {
    return this.users.find(user => user.id === id);
  }

}

export default new User();
