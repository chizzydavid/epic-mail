import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';

// configure chai
chai.use(chaiHttp);
chai.should();
const url = '/api/v1/';

describe('Testing User Endpoints /api/v1/', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTU1MTc1NzE4NX0.Lk-grtg76D3mroOGzXE5UuIt240hZLsKfRJWdIxNbc4';

  // testing POST routes to create a new user
  describe('POST/ auth/signup - Signup a User', () => {
    const endPoint = 'auth/signup';
    it('Should return status 201(Created) and a User object', () => {
      const user = {
        id: 5,
        email: 'cindyroland@gmail.com',
        firstName: 'Cindy',
        lastName: 'Roland',
        password: 'cindyroland',
        isAdmin: false,
      };

      chai.request(app)
        .post(`${url}${endPoint}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data').which.is.an('object');
        });
    });

    it('Should return status 400(Bad Request) if user input is incomplete.', () => {
      const user = {
        id: 5,
        firstName: 'Cindy',
        lastName: 'Roland',
        password: 'cindyroland',
        isAdmin: false,
      };

      chai.request(app)
        .post(`${url}${endPoint}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').equal('All fields are required.');
        });
    });
  });

  // testing POST routes to login a user
  describe('POST/ auth/login - Login a User', () => {
    const endPoint = 'auth/login';
    it('Should return status 200(OK) and a User Object', () => {
      const user = {
        email: 'cindyroland@gmail.com',
        password: 'cindyroland',
      };

      chai.request(app)
        .post(`${url}${endPoint}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('object');
        });
    });

    it('Should return status 400(Bad Request) if user input is incomplete', () => {
      const user = {
        password: 'cindyroland',
      };

      chai.request(app)
        .post(`${url}${endPoint}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').equal('All fields are required.');
        });
    });

    it('Should return status 404(Not Found) if user email is invalid', () => {
      const user = {
        email: 'unknown@gmail.com',
        password: 'cindyroland',
      };

      chai.request(app)
        .post(`${url}${endPoint}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('User not found.');
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
          res.body.should.have.property('error').equal('Invalid password.');
        });
    });
  });

  // testing GET route to get all users
  describe('GET/ users - Get all Users', () => {
    const endPoint = 'users';

    it('Should return status 200(OK) and an array of User objects', () => {
      chai.request(app)
        .get(`${url}${endPoint}`)
        .set({ 'access-token': token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('array');
        });
    });


    it('Should return status 400(Bad Request) when there is no Token Provided', () => {
      chai.request(app)
        .get(`${url}${endPoint}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').equal('No Authentication Token Provided.');
        });
    });
  });

  // testing GET route to get a single user
  describe('GET/ users/:id - Get single User', () => {
    const endPoint = 'users/';

    it('Should return status 200(OK) and a User object', () => {
      chai.request(app)
        .get(`${url}${endPoint}5`)
        .set({ 'access-token': token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data').which.is.an('object');
        });
    });

    it('Should return status 404(Not Found) if User ID is invalid.', () => {
      chai.request(app)
        .get(`${url}${endPoint}4`)
        .set({ 'access-token': token })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('User not found.');
        });
    });
  });

  // testing PUT route to update user data
  describe('PUT/ users/:id - Update User', () => {
    const endPoint = 'users/';
    const user = {
      id: 5,
      email: 'cindyroland@gmail.com',
      firstName: 'Cindy',
      lastName: 'Roland',
      password: 'updatedpassword',
      isAdmin: false,
    };

    it('Should return status 201(Created) and a User object', () => {
      chai.request(app)
        .put(`${url}${endPoint}5`)
        .set({ 'access-token': token })
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data').which.is.an('object');
        });
    });

    it('Should return status 404(Not Found) if User ID is invalid', () => {
      chai.request(app)
        .put(`${url}${endPoint}4`)
        .set({ 'access-token': token })
        .send(user)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('User not found.');
        });
    });
  });


  // testing DELETE route to delete a user
  describe('DELETE/ users/:id - Delete User', () => {
    const endPoint = 'users/';

    it('Should return status 204(Deleted)', () => {
      chai.request(app)
        .delete(`${url}${endPoint}5`)
        .set({ 'access-token': token })
        .end((err, res) => {
          res.should.have.status(204);
        });
    });

    it('Should return status 404(Not Found) if User ID is invalid', () => {
      chai.request(app)
        .delete(`${url}${endPoint}4`)
        .set({ 'access-token': token })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').equal('User not found.');
        });
    });
  });
});
