import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

chai.use(chaiHttp);
chai.should();

let token;
const url = '/api/v2/groups';

describe('Testing Group Endpoints /api/v2/groups', () => {
  before((done) => {
    const user = {
      email: 'johnsnow@gmail.com',
      firstName: 'John',
      lastName: 'Snow',
      passwordOne: 'johnsnow',
      passwordTwo: 'johnsnow',
    };
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send(user)
      .end(done);
  });

  before((done) => {
    const user = {
      email: 'johnsnow@gmail.com',
      password: 'johnsnow',
    };
    chai.request(app)
      .post('/api/v2/auth/login')
      .send(user)
      .end((err, res) => {
        token = res.body.data[0].token;
        done();
      });
  });

  describe('POST/ - Create a Group', () => {
    it('Should return status 201(Created) and a Group object', (done) => {
      const group = {
        name: 'Bootcamp Guys',
        description: 'New group for all my bootcamp buddies.',
        members: [2, 4]
      };

      chai.request(app)
        .post(`${url}`)
        .set('authorization', token)
        .send(group)
        .end((err, res) => {
          res.body.should.have.status(201);
          res.body.should.have.property('data').which.is.an('array');
          done();
        });
    });

    it('Should return status 400(Bad Request) if user input incomplete.', (done) => {
      const group = {
        name: 'Hello Mail',
        description: '  ',
      };
      chai.request(app)
        .post(`${url}`)
        .set('authorization', token)
        .send(group)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').which.is.an('array');
          done();
        });
    });

    it('Should return status 400(Bad Request) when there is no Token Provided', (done) => {
      const group = {
        name: 'Hello Mail',
        description: 'Mailing group',
      };

      chai.request(app)
        .post(`${url}`)
        .send(group)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').equal('No Authentication Token Provided.');
          done();
        });
    });
  });

  describe('GET/ - Get all user groups', () => {
    it('Should return status 200(OK) and an array of user groups', (done) => {
      chai.request(app)
        .get(`${url}`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
          done();
        });
    });
  });

  describe('GET/ :groupId/:name - Edit Group Name', () => {
    it('Should return status 200(OK) and the Updated group', (done) => {
      chai.request(app)
        .patch(`${url}/1/Bootcamp Guys Updated`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
          done();
        });
    });
  });

  describe('GET/ :groupId/users - Add new users to a group', () => {
    it('Should return status 201(OK) and a message of success.', (done) => {
      chai.request(app)
        .post(`${url}/1/users`)
        .set('authorization', token)
        .send({ members: [3, 6] })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data').which.is.an('array');
          done();
        });
    });

    it('Should return status 404(Not Found) and \'Group not found\' if Group Id doesnt exist.', (done) => {
      chai.request(app)
        .post(`${url}/1000/users`)
        .set('authorization', token)
        .send({ users: [3, 6] })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('Group not found.');
          done();
        });
    });
  });

  describe('DELETE/ :groupId/users/:id - Delete a user from a group', () => {
    it('Should return status 200(OK) and a message of success.', (done) => {
      chai.request(app)
        .delete(`${url}/1/users/6`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').equal('User deleted successfully.');
          done();
        });
    });

    it('Should return status 404(Not Found) and \'Group not found\' if Group Id doesnt exist.', (done) => {
      chai.request(app)
        .delete(`${url}/1000/users/6`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('Group not found.');
          done();
        });
    });

    it('Should return status 404(Not Found) and \'User is not a member of this group\' if user isnt part of the group', (done) => {
      chai.request(app)
        .delete(`${url}/1/users/6000`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('User is not a member of this group.');
          done();
        });
    });
  });

  describe('POST/ :groups/:groupId/messages - Send message to a group', () => {
    it('Should return status 201(Created) and a Message object', (done) => {
      const message = {
        subject: 'Hello Bootcamp guys',
        message: 'Hey bootcampers, hope you guys are having a splendid time.',
      };

      chai.request(app)
        .post(`${url}/1/messages`)
        .set('authorization', token)
        .send(message)
        .end((err, res) => {
          res.body.should.have.status(201);
          res.body.should.have.property('data').which.is.an('array');
          done();
        });
    });

    it('Should return status 404(Not Found) and \'Group not found\'', (done) => {
      const message = {
        subject: 'Hello Bootcamp guys',
        message: 'Hellot all my bootcamp men and women.',
      };

      chai.request(app)
        .post(`${url}/1000/messages`)
        .set('authorization', token)
        .send(message)
        .end((err, res) => {
          res.body.should.have.status(404);
          res.body.should.have.property('error').equal('Group not found.');
          done();
        });
    });
  });

  describe('GET /:groupId - Get a single Group', () => {
    it('Should return status 200(OK) and a single group object', (done) => {
      chai.request(app)
        .get(`${url}/1`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
          done();
        });
    });

    it('Should return status 404(Not Found) if Group ID is invalid.', (done) => {
      chai.request(app)
        .get(`${url}/5000`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('Group not found.');
          done();
        });
    });
  });

  describe('DELETE/ :groupId - Delete a Group', () => {
    it('Should return status 200(Group deleted successfully)', (done) => {
      chai.request(app)
        .delete(`${url}/1`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').equal('Group deleted successfully.');
          done();
        });
    });

    it('Should return status 404(Not found) if Group ID is invalid', (done) => {
      chai.request(app)
        .delete(`${url}/500`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('Group not found.');
          done();
        });
    });
  });
});
