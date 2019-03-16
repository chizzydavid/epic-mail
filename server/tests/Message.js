import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

// configure chai
chai.use(chaiHttp);
chai.should();

const url = '/api/v1/messages';
describe('Testing Message Endpoints /api/v1/messages', () => {
  // testing POST route to create a new messsage
  // error messages should be specified in the tests
  describe('POST/ - Send a Message', () => {
    it('Should return status 201(Created) and a Message object', () => {
      const message = {
        id: 4,
        subject: 'Hello Mail',
        message: "It's nice to meet you, Send me a mail sometime.",
        parentMessageId: 0,
        senderId: 4,
        receiverId: 5,
        status: 'sent',
      };

      chai.request(app)
        .post(`${url}`)
        .send(message)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data').which.is.an('object');
        });
    });

    it('Should return status 400(Bad Request) if user input incomplete.', () => {
      const message = {
        id: 1,
        subject: 'Hello Mail',
        message: '',
        parentMessageId: 0,
        senderId: 4,
        receiverId: 5,
        status: 'sent',
      };

      chai.request(app)
        .post(`${url}`)
        .send(message)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').which.is.an('array');
        });
    });

    /*    it('Should return status 400(Bad Request) when there is no Token Provided', () => {
      const message = {
        id: 1,
        subject: 'Hello Mail',
        message: 'It\'s nice to meet you, Send me a mail sometime.',
        parentMessageId: 0,
        senderId: 4,
        receiverId: 5,
        status: 'sent',
      };

      chai.request(app)
        .post(`${url}`)
        .send(message)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').equal('No Authentication Token Provided.');
        });
    }); */
  });

  // testing GET route to get all recieved messages
  describe('GET/ - Get all recieved messages', () => {
    it('Should return status 200(OK) and an array of messages', () => {
      chai.request(app)
        .get(`${url}`)
        .send({ id: 6 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
        });
    });
  });

  // testing GET route to get all unread messages
  describe('GET/ unread - Get all unread messages', () => {
    it('Should return status 200(OK) and an array of messages', () => {
      chai.request(app)
        .get(`${url}/unread`)
        .send({ id: 6 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
        });
    });
  });

  // testing GET route to get all sent messages
  describe('GET/ sent - Get all sent messages', () => {
    it('Should return status 200(OK) and an array of messages', () => {
      chai.request(app)
        .get(`${url}/sent`)
        .send({ id: 6 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
        });
    });
  });

  // testing GET route to get a single message
  describe('GET/ :id - Get all a single message', () => {
    it('Should return status 200(OK) and a single message object', () => {
      chai.request(app)
        .get(`${url}/4`)
        .send({ id: 6 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('object');
        });
    });

    it('Should return status 404(Not Found) if Message ID is invalid.', () => {
      chai.request(app)
        .get(`${url}/5`)
        .send({ id: 6 })
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
        .delete(`${url}/4`)
        .send({ id: 6 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').equal('Message successfully deleted.');
        });
    });

    it('Should return status 404(Not found) if Message ID is invalid', () => {
      chai.request(app)
        .delete(`${url}/5`)
        .send({ id: 6 })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('Message not found.');
        });
    });
  });
});
