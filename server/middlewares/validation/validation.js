const Validate = {
  signUp(req, res, next) {
    const {
      id, firstName, lastName, email, passwordOne, passwordTwo,
    } = req.body;
    const errors = [];

    const nameRegx = /^[a-zA-Z]{2,}$/;

    if (typeof id === 'undefined') errors.push('There is no id field available.');

    else if (typeof id !== 'number') { errors.push('Please enter a valid user Id.'); }

    if (typeof firstName === 'undefined') errors.push('There is no firstName field available.');

    else if (firstName.trim() === '') { errors.push('Please enter a first name.'); } else
    if (!nameRegx.test(firstName)) errors.push('Please enter a valid first name');

    if (typeof lastName === 'undefined') errors.push('There is no lastName field available.');

    else if (lastName.trim() === '') { errors.push('Please enter a last name.'); } else
    if (!nameRegx.test(lastName)) errors.push('Please enter a valid last name.');

    if (typeof email === 'undefined') errors.push('There is no email field available.');
    else if (email.trim() === '') { errors.push('Please enter an email address.'); } else
    if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.trim())) errors.push('Please enter a valid email address.');


    if (typeof passwordOne === 'undefined' || typeof passwordTwo === 'undefined') errors.push('There is a missing password field.');

    else if (passwordOne.trim() === '') errors.push('Please enter a password');

    else if (passwordTwo.trim() === '') errors.push('Please re-enter your password.');

    else if (passwordOne.trim().length < 6) { errors.push('Your password must be at least 6 characters in length.'); } else
    if (passwordOne.trim() !== passwordTwo.trim()) errors.push('Your two passwords don\'t match.');
    else if (!/^[\w]{6,20}$/.test(passwordOne.trim())) { errors.push('Your password can only contain alphanumeric characters.'); }

    if (errors.length !== 0) { res.status(400).json({ status: 400, error: errors }); return; }

    next();
  },

  login(req, res, next) {
    const { email, password } = req.body;
    const errors = [];

    if (typeof email === 'undefined') errors.push('There is no email field available.');

    else if (email.trim() === '') errors.push('Please enter an email address.');
    else
    if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.trim())) { errors.push('Invalid login details.'); }

    if (typeof password === 'undefined') errors.push('There is no password field available.');
    else if (password.trim() === '') errors.push('Please enter a password');

    if (errors.length !== 0) { res.status(400).json({ status: 400, error: errors }); return; }

    next();
  },

  updateUser(req, res, next) {
    const {
      id, firstName, lastName, email, passwordOne, passwordTwo,
    } = req.body;
    const errors = [];

    const nameRegx = /^[a-zA-Z]{2,}$/;

    if (typeof id !== 'undefined'){
      if (typeof id !== 'number') { errors.push('Please enter a valid user Id.'); }
    }

    if (typeof firstName !== 'undefined') {
      if (firstName.trim() === '') { errors.push('Please enter a first name.'); } else
          if (!nameRegx.test(firstName)) errors.push('Please enter a valid first name');
    } 

    if (typeof lastName !== 'undefined') {
      if (lastName.trim() === '') { errors.push('Please enter a last name.'); } else
      if (!nameRegx.test(lastName)) errors.push('Please enter a valid last name.');
    }

    if (typeof email !== 'undefined') {
      if (email.trim() === '') { errors.push('Please enter an email address.'); } else
      if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.trim())) errors.push('Please enter a valid email address.');      
    }

    if (passwordOne && !passwordTwo || !passwordOne && passwordTwo) {errors.push('The two password fields are required.')}
    
    if (passwordOne && passwordTwo) {
      if (passwordOne.trim() === '') errors.push('Password is required');

      if (passwordTwo.trim() === '') errors.push('Please confirm your password.');

      else if (passwordOne.trim().length < 6) { errors.push('Password must be at least 6 characters in length.'); } else
      if (passwordOne.trim() !== passwordTwo.trim()) errors.push('Your two passwords don\'t match.');
      else if (!/^[\w]{6,20}$/.test(passwordOne.trim())) { errors.push('Your password can only contain alphanumeric characters.'); }      
    }

    if (errors.length !== 0) { res.status(400).json({ status: 400, error: errors }); return; }

    next();
  },

  sendMessage(req, res, next) {
    const {
      id, subject, message, receiverId, status
    } = req.body;
    const errors = [];
    if (typeof id === 'undefined') errors.push('There is no id field available.');
    else if (typeof id !== 'number') { errors.push('Please enter a valid user Id.'); }

    if (typeof subject === 'undefined') errors.push('There is no subject field available.');
    else if (subject.trim() === '') { errors.push('Message must have a subject.'); }

    if (typeof message === 'undefined') errors.push('There is no message field available.');
    else if (message.trim() === '') { errors.push('Please enter a message to send.'); }

    if (typeof receiverId === 'undefined') errors.push('There is no receiverId field available.');
    else if (receiverId === '') { errors.push('Please enter the message recipient'); }

    if (errors.length !== 0) { res.status(400).json({ status: 400, error: errors }); return; }

    next();
  },
};

export default Validate;
