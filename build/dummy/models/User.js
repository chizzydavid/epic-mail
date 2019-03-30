"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Helper = _interopRequireDefault(require("../../controllers/Helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var User =
/*#__PURE__*/
function () {
  function User() {
    _classCallCheck(this, User);

    this.users = [];
  }

  _createClass(User, [{
    key: "create",
    value: function create(user) {
      var token = _Helper.default.generateToken(user.id);

      var newUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.passwordOne,
        isAdmin: user.isAdmin,
        token: token
      };
      this.users.push(newUser);
      return {
        message: 'New user created successfully.',
        user: newUser
      };
    }
  }, {
    key: "login",
    value: function login(user) {
      var foundUser = this.users.find(function (dbuser) {
        return dbuser.email === user.email;
      });

      if (!foundUser) {
        return {
          message: 'User not found'
        };
      }

      if (foundUser.password !== user.password) {
        return {
          message: 'Invalid password'
        };
      }

      return {
        message: 'User login successful',
        user: foundUser
      };
    }
  }, {
    key: "findAll",
    value: function findAll() {
      return this.users;
    }
  }, {
    key: "findUser",
    value: function findUser(id) {
      return this.users.find(function (user) {
        return user.id === id;
      });
    }
  }, {
    key: "update",
    value: function update(id, data) {
      var user = this.findUser(Number(id));
      user.email = data.email || user.email;
      user.firstName = data.firstName || user.firstName;
      user.lastName = data.lastName || user.lastName;
      user.firstName = data.firstName || user.firstName;
      user.password = data.password || user.password;
      user.isAdmin = data.isAdmin || user.isAdmin;
      return {
        message: 'User updated successfully',
        user: user
      };
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      var user = this.findUser(id);
      var index = this.users.indexOf(user);
      this.users.splice(index, 1);
      return {};
    }
  }]);

  return User;
}();

var _default = new User();

exports.default = _default;
//# sourceMappingURL=User.js.map