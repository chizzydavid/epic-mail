"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// configure chai
_chai.default.use(_chaiHttp.default);

_chai.default.should();

var url = '/api/v1/messages';
describe('Testing Message Endpoints /api/v1/messages', function () {
  var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTU1MTc1NzE4NX0.Lk-grtg76D3mroOGzXE5UuIt240hZLsKfRJWdIxNbc4'; // testing POST route to create a new messsage
  // error messages should be specified in the tests

  describe('POST/ - Send a Message', function () {
    it('Should return status 201(Created) and a Message object', function () {
      var message = {
        id: 4,
        subject: 'Hello Mail',
        message: "It's nice to meet you, Send me a mail sometime.",
        parentMessageId: 0,
        senderId: 4,
        receiverId: 5,
        status: 'sent'
      };

      _chai.default.request(_server.default).post("".concat(url)).set({
        'access-token': token
      }).send(message).end(function (err, res) {
        res.should.have.status(201);
        res.body.should.have.property('data').which.is.an('object');
      });
    });
    it('Should return status 400(Bad Request) if user input incomplete.', function () {
      var message = {
        id: 1,
        subject: 'Hello Mail',
        message: '',
        parentMessageId: 0,
        senderId: 4,
        receiverId: 5,
        status: 'sent'
      };

      _chai.default.request(_server.default).post("".concat(url)).set({
        'access-token': token
      }).send(message).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.have.property('error').which.is.an('array');
      });
    });
    it('Should return status 400(Bad Request) when there is no Token Provided', function () {
      var message = {
        id: 1,
        subject: 'Hello Mail',
        message: 'It\'s nice to meet you, Send me a mail sometime.',
        parentMessageId: 0,
        senderId: 4,
        receiverId: 5,
        status: 'sent'
      };

      _chai.default.request(_server.default).post("".concat(url)).send(message).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.have.property('error').equal('No Authentication Token Provided.');
      });
    });
  }); // testing GET route to get all recieved messages

  describe('GET/ - Get all recieved messages', function () {
    it('Should return status 200(OK) and an array of messages', function () {
      _chai.default.request(_server.default).get("".concat(url)).set({
        'access-token': token
      }).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('array');
      });
    });
  }); // testing GET route to get all unread messages

  describe('GET/ unread - Get all unread messages', function () {
    it('Should return status 200(OK) and an array of messages', function () {
      _chai.default.request(_server.default).get("".concat(url, "/unread")).set({
        'access-token': token
      }).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('array');
      });
    });
  }); // testing GET route to get all sent messages

  describe('GET/ sent - Get all sent messages', function () {
    it('Should return status 200(OK) and an array of messages', function () {
      _chai.default.request(_server.default).get("".concat(url, "/sent")).set({
        'access-token': token
      }).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('array');
      });
    });
  }); // testing GET route to get a single message

  describe('GET/ :id - Get all a single message', function () {
    it('Should return status 200(OK) and a single message object', function () {
      _chai.default.request(_server.default).get("".concat(url, "/4")).set({
        'access-token': token
      }).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property('data').which.is.an('object');
      });
    });
    it('Should return status 404(Not Found) if Message ID is invalid.', function () {
      _chai.default.request(_server.default).get("".concat(url, "/5")).set({
        'access-token': token
      }).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('Message not found.');
      });
    });
  }); // testing DELETE route to delete a messsage

  describe('DELETE/ :id - Delete a Message', function () {
    it('Should return status 204(Deleted)', function () {
      _chai.default.request(_server.default).delete("".concat(url, "/4")).set({
        'access-token': token
      }).end(function (err, res) {
        res.should.have.status(204);
      });
    });
    it('Should return status 404(Not found) if Message ID is invalid', function () {
      _chai.default.request(_server.default).delete("".concat(url, "/5")).set({
        'access-token': token
      }).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.have.property('error').equal('Message not found.');
      });
    });
  });
});
//# sourceMappingURL=Message.spec.js.map