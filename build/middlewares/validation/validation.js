"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Validate = {
  signUp: function signUp(req, res, next) {
    var _req$body = req.body,
        firstName = _req$body.firstName,
        lastName = _req$body.lastName,
        email = _req$body.email,
        passwordOne = _req$body.passwordOne,
        passwordTwo = _req$body.passwordTwo;
    var errors = [];
    var nameRegx = /^[a-zA-Z]{2,}$/;
    firstName.trim() === '' ? errors.push('Please enter a first name updated version.') : !nameRegx.test(firstName) ? errors.push('Please enter a valid first name') : '';
    lastName.trim() === '' ? errors.push('Please enter a last name.') : !nameRegx.test(lastName) ? errors.push('Please enter a valid last name.') : '';
    email.trim() === '' ? errors.push('Please enter an email address.') : !/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.trim()) ? errors.push('Please enter a valid email address.') : '';
    passwordOne.trim() === '' ? errors.push('Please enter a password') : passwordTwo.trim() === '' ? errors.push('Please re-enter your password.') : passwordOne.trim().length < 6 ? errors.push('Your password must be at least 6 characters in length.') : passwordOne.trim() !== passwordTwo.trim() ? errors.push('Your two passwords don\'t match.') : !/^[\w]{6,20}$/.test(passwordOne.trim()) ? errors.push('Your password can only contain alphanumeric characters.') : '';
    if (errors.length !== 0) return res.status(400).json({
      'status': 400,
      'error': errors
    });
    next();
  },
  login: function login(req, res, next) {
    var _req$body2 = req.body,
        email = _req$body2.email,
        password = _req$body2.password;
    var errors = [];
    email.trim() === '' ? errors.push('Please enter an email address.') : !/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.trim()) ? errors.push('Please enter a valid email address.') : '';
    password.trim() === '' ? errors.push('Please enter a password') : '';
    if (errors.length !== 0) return res.status(400).json({
      'status': 400,
      'error': errors
    });
    next();
  },
  sendMessage: function sendMessage(req, res, next) {
    var _req$body3 = req.body,
        subject = _req$body3.subject,
        message = _req$body3.message,
        senderId = _req$body3.senderId,
        receiverId = _req$body3.receiverId;
    var errors = [];
    subject.trim() === '' ? errors.push('Message must have a subject.') : '';
    message.trim() === '' ? errors.push('Please enter a message to send.') : '';
    senderId === '' ? errors.push('No sender specified.') : '';
    receiverId === '' ? errors.push('Please enter the message recipient') : '';
    if (errors.length !== 0) return res.status(400).json({
      'status': 400,
      'error': errors
    });
    next();
  }
};
var _default = Validate;
exports.default = _default;
//# sourceMappingURL=validation.js.map