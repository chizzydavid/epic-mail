import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

// configure chai
chai.use(chaiHttp);
chai.should();
const url = '/api/v1/';

describe('Testing User Endpoints /api/v1/', () => {
  // testing POST routes to create a new user
  describe('POST/ auth/signup - Signup a User', () => {
    const endPoint = 'auth/signup';
    it('Should return status 201(Created) and a User token', () => {
      const user = {
        email: 'cindyroland@gmail.com',
        firstName: 'Cindy',
        lastName: 'Roland',
        passwordOne: 'cindyroland',
        passwordTwo: 'cindyroland',
      };

      chai.request(app)
        .post(`${url}${endPoint}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data').which.is.an('array');
        });
    });

    it('Should return status 400(Bad Request) if user input is incomplete.', () => {
      const user = {
        email: '',
        firstName: 'Cindy',
        lastName: 'Roland',
        passwordOne: 'cindyroland',
        passwordTwo: 'cindyroland',
      };

      chai.request(app)
        .post(`${url}${endPoint}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').which.is.an('array');
        });
    });
  });

  //testing POST routes to login a user
  describe('POST/ auth/login - Login a User', () => {
    const endPoint = 'auth/login';
    it('Should return status 200(OK) and a User token', () => {
      const user = {
        email: 'davidchizindu@gmail.com',
        password: 'chizindudavid',
      };

      chai.request(app)
        .post(`${url}${endPoint}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
        });
    });

    it('Should return status 400(Bad Request) if user input is incomplete', () => {
      const user = {
        email: '',
        password: 'cindyroland',
      };

      chai.request(app)
        .post(`${url}${endPoint}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').which.is.an('array');
        });
    });

    it('Should return status 400(Bad Request) if user email is invalid', () => {
      const user = {
        email: 'unknown@gmail.com',
        password: 'cindyroland',
      };

      chai.request(app)
        .post(`${url}${endPoint}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').equal('Invalid Login Credentials.');
        });
    });

    it('Should return status 400(Bad Request) if user password in invalid', () => {
      const user = {
        email: 'cindyroland@gmail.com',
        password: 'wrongpassword',
      };

      chai.request(app)
        .post(`${url}${endPoint}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').equal('Invalid Login Credentials.');
        });
    });
  });

  // testing GET route to get all users
  describe('GET/ users - Get all Users', () => {
    const endPoint = 'users';

    it('Should return status 200(OK) and an array of User objects', () => {
      chai.request(app)
        .get(`${url}${endPoint}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
        });
    });
  });

  // testing GET route to get a single user
  describe('GET/ users/:id - Get single User', () => {
    const endPoint = 'users/';

    it('Should return status 200(OK) and a User object', () => {
      chai.request(app)
        .get(`${url}${endPoint}2`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
        });
    });

    it('Should return status 404(Not Found) if User ID does not exist.', () => {
      chai.request(app)
        .get(`${url}${endPoint}60`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('User not found.');
        });
    });
  });


  // testing DELETE route to delete a user
  describe('DELETE/ users/:id - Delete User', () => {
    const endPoint = 'users/';

    it('Should return status 200(Deleted)', () => {
      chai.request(app)
        .delete(`${url}${endPoint}2`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').equal('User successfully deleted.');
        });
    });

    it('Should return status 400(Unauthorized access) if User ID is invalid', () => {
      chai.request(app)
        .delete(`${url}${endPoint}90`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').equal('Unauthorized access.');
        });
    });
  });
});
