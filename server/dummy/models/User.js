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
  
  update(id, data) {
    const user = this.findUser(Number(id));
    user.email = data.email || user.email;
    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.firstName = data.firstName || user.firstName;
    user.password = data.password || user.password;
    user.isAdmin = data.isAdmin || user.isAdmin;

    return { message: 'User updated successfully', user };
  }

  delete(id) {
    const user = this.findUser(id);
    const index = this.users.indexOf(user);
    this.users.splice(index, 1);
    return {};
  }

}

export default new User();
