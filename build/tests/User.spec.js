"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// configure chai
_chai.default.use(_chaiHttp.default);

_chai.default.should();

var url = '/api/v1/';
describe('Testing User Endpoints /api/v1/', function () {
  var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTU1MTc1NzE4NX0.Lk-grtg76D3mroOGzXE5UuIt240hZLsKfRJWdIxNbc4'; // testing POST routes to create a new user

  describe('POST/ auth/signup - Signup a User', function () {
    var endPoint = 'auth/signup';
    it('Should return status 201(Created) and a User object', function () {
      var user = {
        id: 5,
        email: 'cindyroland@gmail.com',
        firstName: 'Cindy',
        lastName: 'Roland',
        passwordOne: 'cindyroland',
        passwordTwo: 'cindyroland',
        isAdmin: false
      };

      _chai.default.request(_server.default).post("".concat(url).concat(endPoint)).send(user).end(function (err, res) {
        res.should.have.status(201);
        res.body.should.have.property('data').which.is.an('object');
      });
    });
    it('Should return status 400(Bad Request) if user input is incomplete.', function () {
      var user = {
        email: '',
        firstName: 'Cindy',
        lastName: 'Roland',
        passwordOne: 'cindyroland',
        passwordTwo: 'cindyroland',
        isAdmin: false
      };

      _chai.default.request(_server.default).post("".concat(url).concat(endPoint)).send(user).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.have.property('error').which.is.an('array');
      });
    });
  }); // testing POST routes to login a user

  describe('POST/ auth/login - Login a User', function () {
    var endPoint = 'auth/login';
    it('Should return status 200(OK) and a User Object', function () {
      var user = {
        email: 'cindyroland@gmail.com',
        password: 'cindyroland'
      };

      _chai.default.request(_server.default).post("".concat(url).concat(endPoint)).send(user).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('object');
      });
    });
    it('Should return status 400(Bad Request) if user input is incomplete', function () {
      var user = {
        email: '',
        password: 'cindyroland'
      };

      _chai.default.request(_server.default).post("".concat(url).concat(endPoint)).send(user).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.have.property('error').which.is.an('array');
      });
    });
    it('Should return status 404(Not Found) if user email is invalid', function () {
      var user = {
        email: 'unknown@gmail.com',
        password: 'cindyroland'
      };

      _chai.default.request(_server.default).post("".concat(url).concat(endPoint)).send(user).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('User not found.');
      });
    });
    it('Should return status 400(Bad Request) if user password in invalid', function () {
      var user = {
        email: 'cindyroland@gmail.com',
        password: 'wrongpassword'
      };

      _chai.default.request(_server.default).post("".concat(url).concat(endPoint)).send(user).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.have.property('error').equal('Invalid password.');
      });
    });
  }); // testing GET route to get all users

  describe('GET/ users - Get all Users', function () {
    var endPoint = 'users';
    it('Should return status 200(OK) and an array of User objects', function () {
      _chai.default.request(_server.default).get("".concat(url).concat(endPoint)).set({
        'access-token': token
      }).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('array');
      });
    });
    it('Should return status 400(Bad Request) when there is no Token Provided', function () {
      _chai.default.request(_server.default).get("".concat(url).concat(endPoint)).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.have.property('error').equal('No Authentication Token Provided.');
      });
    });
  }); // testing GET route to get a single user

  describe('GET/ users/:id - Get single User', function () {
    var endPoint = 'users/';
    it('Should return status 200(OK) and a User object', function () {
      _chai.default.request(_server.default).get("".concat(url).concat(endPoint, "5")).set({
        'access-token': token
      }).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('object');
      });
    });
    it('Should return status 404(Not Found) if User ID is invalid.', function () {
      _chai.default.request(_server.default).get("".concat(url).concat(endPoint, "4")).set({
        'access-token': token
      }).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('User not found.');
      });
    });
  }); // testing PUT route to update user data

  describe('PUT/ users/:id - Update User', function () {
    var endPoint = 'users/';
    var user = {
      id: 5,
      email: 'cindyroland@gmail.com',
      firstName: 'Cindy',
      lastName: 'Roland',
      password: 'updatedpassword',
      isAdmin: false
    };
    it('Should return status 201(Created) and a User object', function () {
      _chai.default.request(_server.default).put("".concat(url).concat(endPoint, "5")).set({
        'access-token': token
      }).send(user).end(function (err, res) {
        res.should.have.status(201);
        res.body.should.have.property('data').which.is.an('object');
      });
    });
    it('Should return status 404(Not Found) if User ID is invalid', function () {
      _chai.default.request(_server.default).put("".concat(url).concat(endPoint, "4")).set({
        'access-token': token
      }).send(user).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('User not found.');
      });
    });
  }); // testing DELETE route to delete a user

  describe('DELETE/ users/:id - Delete User', function () {
    var endPoint = 'users/';
    it('Should return status 204(Deleted)', function () {
      _chai.default.request(_server.default).delete("".concat(url).concat(endPoint, "5")).set({
        'access-token': token
      }).end(function (err, res) {
        res.should.have.status(204);
      });
    });
    it('Should return status 404(Not Found) if User ID is invalid', function () {
      _chai.default.request(_server.default).delete("".concat(url).concat(endPoint, "4")).set({
        'access-token': token
      }).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('User not found.');
      });
    });
  });
});
//# sourceMappingURL=User.spec.js.map