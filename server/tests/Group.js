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
      "email": "johnsnow@gmail.com",
      "firstName": "John",
      "lastName": "Snow",
      "passwordOne": "johnsnow",
      "passwordTwo": "johnsnow"
    };
    chai.request(app)
      .post(`/api/v2/auth/signup`)
      .send(user)
      .end(done);
  })

  before((done) => {
    const user = {
      email: 'johnsnow@gmail.com',
      password: 'johnsnow'
    };
    chai.request(app)
      .post(`/api/v2/auth/login`)
      .send(user)
      .end((err, res) => {
        token = res.body.data[0].token;
        done();
      });
  })

  describe('POST/ - Create a Group', () => {
    it('Should return status 201(Created) and a Group object', (done) => {
      const group = {
        name: 'Bootcamp Guys',
        description: "New group for all my bootcamp buddies.",
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

    it('Should return status 400(Bad Request) if user input incomplete.', () => {
      const group = {
        name: 'Hello Mail',
        description: '  '
      };

      chai.request(app)
        .post(`${url}`)
        .set('authorization', token)
        .send(group)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').which.is.an('array');
        });
    });

    it('Should return status 400(Bad Request) when there is no Token Provided', () => {
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

/*  describe('GET/ unread - Get all unread messages', () => {
    it('Should return status 200(OK) and an array of messages', () => {
      chai.request(app)
        .get(`${url}/unread`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').equal('You have no unread messages at this time.');
        });
    });
  });

  describe('GET/ sent - Get all sent messages', () => {
    it('Should return status 200(OK) and an array of messages', () => {
      chai.request(app)
        .get(`${url}/sent`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
        });
    });
  });

  describe('GET/ :id - Get a single message', () => {
    it('Should return status 200(OK) and a single message object', () => {
      chai.request(app)
        .get(`${url}/1`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
        });
    });

    it('Should return status 404(Not Found) if Message ID is invalid.', () => {
      chai.request(app)
        .get(`${url}/5`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('Message not found.');
        });
    });
  });

  // testing DELETE route to delete a messsage
  describe('DELETE/ :id - Delete a Message', () => {
    it('Should return status 200(Message deleted successfully)', () => {
      chai.request(app)
        .delete(`${url}/1`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').equal('Message successfully deleted.');
        });
    });

    it('Should return status 404(Not found) if Message ID is invalid', () => {
      chai.request(app)
        .delete(`${url}/5`)
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('Message not found.');
        });
    });
  });*/
});
