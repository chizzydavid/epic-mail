"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// configure chai
_chai.default.use(_chaiHttp.default);

_chai.default.should();

const url = '/api/v2/';
let token;
describe('Testing User Endpoints /api/v2/', () => {
  describe('POST/ auth/signup - Signup a User', () => {
    const endPoint = 'auth/signup';
    it('Should return status 201(Created) and a User token', done => {
      const user = {
        email: 'cindyroland@gmail.com',
        firstName: 'Cindy',
        lastName: 'Roland',
        password: 'cindyroland',
        confirmPassword: 'cindyroland'
      };

      _chai.default.request(_server.default).post(`${url}${endPoint}`).send(user).end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('data').which.is.an('array');
        res.body.data[0].should.have.property('token');
        done();
      });
    });
    it('Should return status 400(Bad Request) if user input is incomplete.', () => {
      const user = {
        email: '',
        firstName: 'Cindy',
        lastName: 'Roland',
        password: 'cindyroland',
        confirmPassword: 'cindyroland'
      };

      _chai.default.request(_server.default).post(`${url}${endPoint}`).send(user).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error').which.is.an('array');
      });
    });
  });
  describe('POST/ auth/login - Login a User', () => {
    const endPoint = 'auth/login';
    it('Should return status 200(OK) and a User token', () => {
      const user = {
        email: 'cindyroland@gmail.com',
        password: 'cindyroland'
      };

      _chai.default.request(_server.default).post(`${url}${endPoint}`).send(user).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('array');
      });
    });
    it('Should return status 400(Bad Request) if user input is incomplete', () => {
      const user = {
        email: '',
        password: 'cindyroland'
      };

      _chai.default.request(_server.default).post(`${url}${endPoint}`).send(user).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error').which.is.an('array');
      });
    });
    it('Should return status 400(Bad Request) if user email is invalid', () => {
      const user = {
        email: 'unknown@gmail.com',
        password: 'cindyroland'
      };

      _chai.default.request(_server.default).post(`${url}${endPoint}`).send(user).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error').equal('Invalid Login Credentials.');
      });
    });
    it('Should return status 400(Bad Request) if user password in invalid', () => {
      const user = {
        email: 'cindyroland@gmail.com',
        password: 'wrongpassword'
      };

      _chai.default.request(_server.default).post(`${url}${endPoint}`).send(user).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error').equal('Invalid Login Credentials.');
      });
    });
  });
  describe('GET/ users - Get all Users', () => {
    before(done => {
      const user = {
        email: 'cindyroland@gmail.com',
        password: 'cindyroland'
      };

      _chai.default.request(_server.default).post(`${url}auth/login`).send(user).end((err, res) => {
        token = res.body.data[0].token;
        done();
      });
    });
    const endPoint = 'users';
    it('Should return status 200(OK) and an array of User objects', done => {
      _chai.default.request(_server.default).get(`${url}${endPoint}`).set('authorization', token).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('array');
        done();
      });
    });
  });
  describe('GET/ users/:id - Get single User', () => {
    const endPoint = 'users/';
    it('Should return status 200(OK) and a User object', done => {
      _chai.default.request(_server.default).get(`${url}${endPoint}1`).set('authorization', token).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('array');
        done();
      });
    });
    it('Should return status 404(Not Found) if User ID does not exist.', done => {
      _chai.default.request(_server.default).get(`${url}${endPoint}60`).set('authorization', token).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('User not found.');
        done();
      });
    });
  });
  describe('DELETE/ users/:id - Delete User', () => {
    const endPoint = 'users/';
    it('Should return status 200(Deleted)', done => {
      _chai.default.request(_server.default).delete(`${url}${endPoint}1`).set('authorization', token).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').equal('User successfully deleted.');
        done();
      });
    });
    it('Should return status 404(Unauthorized access) if User ID is invalid', done => {
      _chai.default.request(_server.default).delete(`${url}${endPoint}90`).set('authorization', token).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('User not found.');
        done();
      });
    });
  });
});
//# sourceMappingURL=User.js.map