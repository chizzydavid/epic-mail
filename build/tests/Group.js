"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai.default.use(_chaiHttp.default);

_chai.default.should();

let token;
let creatorToken;
const url = '/api/v2/groups';
describe('Testing Group Endpoints /api/v2/groups', () => {
  before(done => {
    const user = {
      email: 'johnsnow@gmail.com',
      firstName: 'John',
      lastName: 'Snow',
      password: 'johnsnow',
      confirmPassword: 'johnsnow'
    };

    _chai.default.request(_server.default).post('/api/v2/auth/signup').send(user).end(done);
  });
  before(done => {
    const user = {
      email: 'johnsnow@gmail.com',
      password: 'johnsnow'
    };

    _chai.default.request(_server.default).post('/api/v2/auth/login').send(user).end((err, res) => {
      token = res.body.data[0].token;
      done();
    });
  });
  before(done => {
    const user = {
      email: 'davidchizindu@gmail.com',
      password: 'chizindudavid'
    };

    _chai.default.request(_server.default).post('/api/v2/auth/login').send(user).end((err, res) => {
      creatorToken = res.body.data[0].token;
      done();
    });
  });
  after(done => {
    const group = {
      name: 'Port Harcourt Dudes',
      description: 'New group for all my dudes in port harcourt.',
      members: [2, 4]
    };

    _chai.default.request(_server.default).post(`${url}`).set('authorization', creatorToken).send(group).end(done);
  });
  after(done => {
    const group = {
      name: 'Bootcamp Guys',
      description: 'New group for all my bootcamp buddies.',
      members: [2, 4]
    };

    _chai.default.request(_server.default).post(`${url}`).set('authorization', creatorToken).send(group).end(done);
  });
  describe('POST/ - Create a Group', () => {
    it('Should return status 201(Created) and a Group object', done => {
      const group = {
        name: 'Bootcamp Guys',
        description: 'New group for all my bootcamp buddies.',
        members: [2, 4]
      };

      _chai.default.request(_server.default).post(`${url}`).set('authorization', token).send(group).end((err, res) => {
        res.body.should.have.status(201);
        res.body.should.have.property('data').which.is.an('array');
        done();
      });
    });
    it('Should return status 400(Bad Request) if user input incomplete.', done => {
      const group = {
        name: 'Hello Mail',
        description: '  '
      };

      _chai.default.request(_server.default).post(`${url}`).set('authorization', token).send(group).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error').which.is.an('array');
        done();
      });
    });
    it('Should return status 400(Bad Request) when there is no Token Provided', done => {
      const group = {
        name: 'Hello Mail',
        description: 'Mailing group'
      };

      _chai.default.request(_server.default).post(`${url}`).send(group).end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('error').equal('No Authentication Token Provided.');
        done();
      });
    });
  });
  describe('GET/ - Get all user groups', () => {
    it('Should return status 200(OK) and an array of user groups', done => {
      _chai.default.request(_server.default).get(`${url}`).set('authorization', token).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('array');
        done();
      });
    });
  });
  describe('GET/ :groupId - Edit Group Name', () => {
    it('Should return status 200(OK) and the Updated group', done => {
      const group = {
        name: 'Hello Mail updated',
        description: 'Mailing group edited'
      };

      _chai.default.request(_server.default).put(`${url}/1`).set('authorization', token).send(group).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('array');
        done();
      });
    });
  });
  describe('GET/ :groupId/users - Add new users to a group', () => {
    it('Should return status 201(OK) and a message of success.', done => {
      _chai.default.request(_server.default).post(`${url}/1/users`).set('authorization', token).send({
        members: [3, 6]
      }).end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('data').which.is.an('array');
        done();
      });
    });
    it('Should return status 404(Not Found) and \'Group not found\' if Group Id doesnt exist.', done => {
      _chai.default.request(_server.default).post(`${url}/1000/users`).set('authorization', token).send({
        users: [3, 6]
      }).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('Group not found.');
        done();
      });
    });
  });
  describe('DELETE/ :groupId/users/:id - Delete a user from a group', () => {
    it('Should return status 200(OK) and a message of success.', done => {
      _chai.default.request(_server.default).delete(`${url}/1/users/6`).set('authorization', token).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').equal('User deleted successfully.');
        done();
      });
    });
    it('Should return status 404(Not Found) and \'Group not found\' if Group Id doesnt exist.', done => {
      _chai.default.request(_server.default).delete(`${url}/1000/users/6`).set('authorization', token).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('Group not found.');
        done();
      });
    });
    it('Should return status 404(Not Found) and \'User is not a member of this group\' if user isnt part of the group', done => {
      _chai.default.request(_server.default).delete(`${url}/1/users/6000`).set('authorization', token).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('User is not a member of this group.');
        done();
      });
    });
  });
  describe('POST/ :groups/:groupId/messages - Send message to a group', () => {
    it('Should return status 201(Created) and a Message object', done => {
      const message = {
        subject: 'Hello Bootcamp guys',
        message: 'Hey bootcampers, hope you guys are having a splendid time.'
      };

      _chai.default.request(_server.default).post(`${url}/1/messages`).set('authorization', token).send(message).end((err, res) => {
        res.body.should.have.status(201);
        res.body.should.have.property('data').which.is.an('array');
        done();
      });
    });
    it('Should return status 404(Not Found) and \'Group not found\'', done => {
      const message = {
        subject: 'Hello Bootcamp guys',
        message: 'Hellot all my bootcamp men and women.'
      };

      _chai.default.request(_server.default).post(`${url}/1000/messages`).set('authorization', token).send(message).end((err, res) => {
        res.body.should.have.status(404);
        res.body.should.have.property('error').equal('Group not found.');
        done();
      });
    });
  });
  describe('GET /:groupId - Get a single Group', () => {
    it('Should return status 200(OK) and a single group object', done => {
      _chai.default.request(_server.default).get(`${url}/1`).set('authorization', token).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('array');
        done();
      });
    });
    it('Should return status 404(Not Found) if Group ID is invalid.', done => {
      _chai.default.request(_server.default).get(`${url}/5000`).set('authorization', token).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('Group not found.');
        done();
      });
    });
  });
  describe('DELETE/ :groupId - Delete a Group', () => {
    it('Should return status 200(Group deleted successfully)', done => {
      _chai.default.request(_server.default).delete(`${url}/1`).set('authorization', token).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').equal('Group deleted successfully.');
        done();
      });
    });
    it('Should return status 404(Not found) if Group ID is invalid', done => {
      _chai.default.request(_server.default).delete(`${url}/500`).set('authorization', token).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('Group not found.');
        done();
      });
    });
  });
});
//# sourceMappingURL=Group.js.map