"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../../db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Validate = {
  signUp(req, res, next) {
    req.values = {};
    Object.entries(req.body).forEach(input => {
      req.values[input[0]] = input[1].trim();
    });
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    } = req.values;
    const errors = [];
    const nameRegx = /^[a-zA-Z]{2,}$/;

    if (firstName === '') {
      errors.push('Please enter a first name.');
    } else if (!nameRegx.test(firstName)) errors.push('Please enter a valid first name');

    if (lastName === '') {
      errors.push('Please enter a last name.');
    } else if (!nameRegx.test(lastName)) errors.push('Please enter a valid last name.');

    if (email === '') {
      errors.push('Please enter an email address.');
    } else if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email)) errors.push('Please enter a valid email address.');

    if (password === '') errors.push('Please enter a password');else if (confirmPassword === '') errors.push('Please re-enter your password.');else if (password.length < 6) {
      errors.push('Your password must be at least 6 characters in length.');
    } else if (password !== confirmPassword) errors.push('Your two passwords don\'t match.');else if (!/^[\w]{6,20}$/.test(password)) {
      errors.push('Your password can only contain alphanumeric characters.');
    }

    if (errors.length !== 0) {
      return res.status(400).json({
        status: 400,
        error: errors
      });
    }

    _db.default.query('SELECT * FROM users WHERE email = $1', [req.values.email]).then(results => {
      if (results.rowCount) {
        return res.status(400).json({
          status: 400,
          error: 'Email already exists.'
        });
      }

      next();
    }).catch(e => res.status(400).json({
      status: 400,
      error: `There was a problem validating your email address. ${e}`
    }));
  },

  login(req, res, next) {
    req.values = {};
    Object.entries(req.body).forEach(input => {
      req.values[input[0]] = input[1].trim();
    });
    const {
      email,
      password
    } = req.values;
    const errors = [];
    if (email === '') errors.push('Please enter an email address.');else if (!/^\S+@\S+\.[\w]+$/.test(email)) {
      errors.push('Please enter a valid email address.');
    }
    if (password === '') errors.push('Please enter a password');

    if (errors.length !== 0) {
      return res.status(400).json({
        status: 400,
        error: errors
      });
    }

    next();
  },

  sendMessage(req, res, next) {
    req.values = {};
    Object.entries(req.body).forEach(input => {
      req.values[input[0]] = input[1].trim();
    });
    const {
      subject,
      message,
      recipient
    } = req.values;
    const errors = [];

    if (subject === '') {
      errors.push('Message must have a subject.');
    }

    if (message === '') {
      errors.push('Please enter a message to send.');
    } // check for a receiver if the message is not being sent to a group.


    if (!req.params.groupId) {
      if (recipient === '') {
        errors.push('Please enter the message recipient');
      }
    }

    if (errors.length !== 0) {
      return res.status(400).json({
        status: 400,
        error: errors
      });
    }

    next();
  },

  saveDraft(req, res, next) {
    req.values = {};
    Object.entries(req.body).forEach(input => {
      req.values[input[0]] = input[1].trim();
    });
    const {
      subject,
      message,
      recipient
    } = req.values;
    const errors = [];

    if (subject === '' && message === '' && recipient === '') {
      errors.push('Draft must have a subject, message or a receiver\'s address.');
    }

    if (recipient !== '') {
      if (!/^\S+@\S+\.[\w]+$/.test(recipient)) {
        errors.push('Receiver\'s email address is invalid.');
      }
    }

    if (errors.length !== 0) {
      return res.status(400).json({
        status: 400,
        error: errors
      });
    }

    next();
  },

  newGroup(req, res, next) {
    req.values = {};
    Object.entries(req.body).forEach(input => {
      if (typeof input[1] === 'string') {
        req.values[input[0]] = input[1].trim();
      }
    });
    const {
      name,
      description
    } = req.values;
    const errors = [];

    if (name === '') {
      errors.push('Please enter a group name.');
    } else if (!/^[a-zA-Z0-9 ]{4,}$/.test(name)) errors.push('Please enter a valid first name');

    if (description === '') {
      errors.push('Please enter a group description.');
    } else if (!/^[a-zA-Z0-9."';: ]{4,}$/.test(description)) errors.push('Please enter a valid description');

    if (errors.length !== 0) {
      return res.status(400).json({
        status: 400,
        error: errors
      });
    }

    next();
  }

};
var _default = Validate;
exports.default = _default;
//# sourceMappingURL=validation.js.map