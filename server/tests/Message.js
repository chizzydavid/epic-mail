import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

chai.use(chaiHttp);
chai.should();

let senderToken, receiverToken;
const url = '/api/v2/messages';

describe('Testing Message Endpoints /api/v2/messages', () => {
  before((done) => {
    const user = {
      email: 'davidchizindu@gmail.com',
      firstName: 'Chizindu',
      lastName: 'David',
      password: 'chizindudavid',
      confirmPassword: 'chizindudavid',
    };
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send(user)
      .end(done);
  });

  before((done) => {
    const user = {
      email: 'tomcruise@gmail.com',
      firstName: 'Tom',
      lastName: 'Cruise',
      password: 'tomcruise',
      confirmPassword: 'tomcruise',
    };
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send(user)
      .end(done);
  });

  before((done) => {
    const user = {
      email: 'davidchizindu@gmail.com',
      password: 'chizindudavid',
    };
    chai.request(app)
      .post('/api/v2/auth/login')
      .send(user)
      .end((err, res) => {
        senderToken = res.body.data[0].token;
        done();
      });

  });

  before((done) => {
    const user = {
      email: 'tomcruise@gmail.com',
      password: 'tomcruise',
    };
    chai.request(app)
      .post('/api/v2/auth/login')
      .send(user)
      .end((err, res) => {
        receiverToken = res.body.data[0].token;
        done();
      });

  });

  describe('POST/ - Send a Message', () => {
    it('Should return status 201(Created) and a Message object', (done) => {
      const message = {
        subject: 'Hello Mail',
        message: "It's nice to meet you, Send me a mail sometime.",
        receiver: 'tomcruise@gmail.com',
      };

      chai.request(app)
        .post(`${url}`)
        .set('authorization', senderToken)
        .send(message)
        .end((err, res) => {
          res.body.should.have.status(201);
          res.body.should.have.property('data').which.is.an('array');
          done();
        });
    });

    it('Should return status 400(Bad Request) if user input incomplete.', () => {
      const message = {
        subject: 'Hello Mail',
        message: 'my mail app rocks',
        receiver: '',
      };

      chai.request(app)
        .post(`${url}`)
        .set('authorization', senderToken)
        .send(message)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').which.is.an('array');
        });
    });

    it('Should return status 400(Bad Request) when there is no Token Provided', () => {
      const message = {
        subject: 'Hello Mail',
        message: 'It\'s nice to meet you, Send me a mail sometime.',
        receiver: 'cindy@gmail.com',
      };

      chai.request(app)
        .post(`${url}`)
        .send(message)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('error').equal('No Authentication Token Provided.');
        });
    });
  });

  describe('GET/ - Get all recieved messages', () => {
    it('Should return status 200(OK) and an array of messages', (done) => {
      chai.request(app)
        .get(`${url}`)
        .set('authorization', receiverToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
          done();
        });
    });
  });

  describe('GET/ unread - Get all unread messages', () => {
    it('Should return status 200(OK) and an array of messages', () => {
      chai.request(app)
        .get(`${url}/unread`)
        .set('authorization', receiverToken)
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
        .set('authorization', senderToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
        });
    });
  });

  describe('GET/ :id - Get a single Message', () => {
    it('Should return status 200(OK) and a single message object', () => {
      chai.request(app)
        .get(`${url}/1`)
        .set('authorization', senderToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
        });
    });

    it('Should return status 404(Not Found) if Message ID is invalid.', () => {
      chai.request(app)
        .get(`${url}/500`)
        .set('authorization', senderToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('Message not found.');
        });
    });
  });

  describe('DELETE/ retract/:id - Retract a sent Message', () => {
    it('Should return status 200(OK) and a message of success', () => {
      chai.request(app)
        .delete(`${url}/retract/1`)
        .set('authorization', senderToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').equal('Message successfully retracted.');
        });
    });
  });

  describe('DELETE/ sent/:id - Delete a sent Message', () => {
    it('Should return status 200(OK) and a message of success', () => {
      chai.request(app)
        .delete(`${url}/sent/1`)
        .set('authorization', senderToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').equal('Message successfully deleted.');
        });
    });
  });

  describe('DELETE/ :id - Delete a received Message', () => {
    it('Should return status 200(Message deleted successfully)', () => {
      chai.request(app)
        .delete(`${url}/1`)
        .set('authorization', receiverToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').equal('Message successfully deleted.');
        });
    });

    it('Should return status 404(Not found) if Message ID is invalid', () => {
      chai.request(app)
        .delete(`${url}/500`)
        .set('authorization', receiverToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('Message not found.');
        });
    });
  });
});
