import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';

// configure chai
chai.use(chaiHttp);
chai.should();

const url = '/api/v1/messages';
describe('Testing Message Endpoints /api/v1/messages', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTU1MTc1NzE4NX0.Lk-grtg76D3mroOGzXE5UuIt240hZLsKfRJWdIxNbc4';

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
        .set({ 'access-token': token })
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
        parentMessageId: 0,
        senderId: 4,
        receiverId: 5,
        status: 'sent',
      };

      chai.request(app)
        .post(`${url}`)
        .set({ 'access-token': token })
        .send(message)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').equal('All fields are required.');
        });
    });

    it('Should return status 400(Bad Request) when there is no Token Provided', () => {
      const message = {
        id: 1,
        subject: 'Hello Mail',
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
    });
  });

	 // testing GET route to get all recieved messages
  describe('GET/ - Get all recieved messages', () => {
    it('Should return status 200(OK) and an array of messages', () => {
      chai.request(app)
        .get(`${url}`)
        .set({ 'access-token': token })
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
        .set({ 'access-token': token })
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
        .set({ 'access-token': token })
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
        .set({ 'access-token': token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('object');
        });
    });

    it('Should return status 404(Not Found) if Message ID is invalid.', () => {
      chai.request(app)
        .get(`${url}/5`)
        .set({ 'access-token': token })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('Message not found.');
        });
    });
  });

  // testing DELETE route to delete a messsage
  describe('DELETE/ :id - Delete a Message', () => {
    it('Should return status 204(Deleted)', () => {
      chai.request(app)
        .delete(`${url}/4`)
        .set({ 'access-token': token })
        .end((err, res) => {
          res.should.have.status(204);
        });
    });

    it('Should return status 404(Not found) if Message ID is invalid', () => {
      chai.request(app)
        .delete(`${url}/5`)
        .set({ 'access-token': token })
        .end((err, res) => {
          console.log( `${url}/5`);
          res.should.have.status(404);
          res.body.should.have.property('error').equal('Message not found.');
        });
    });
  });
});
