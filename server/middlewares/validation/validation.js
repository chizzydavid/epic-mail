const Validate = {
  signUp(req, res, next) {
    req.values = {};
    Object.entries(req.body).forEach((input) => { req.values[input[0]] = input[1].trim(); });
    const {
      firstName, lastName, email, passwordOne, passwordTwo,
    } = req.values;
    const errors = [];
    const nameRegx = /^[a-zA-Z]{2,}$/;

    if (firstName === '') { errors.push('Please enter a first name.'); } else
    if (!nameRegx.test(firstName)) errors.push('Please enter a valid first name');

    if (lastName === '') { errors.push('Please enter a last name.'); } else
    if (!nameRegx.test(lastName)) errors.push('Please enter a valid last name.');

    if (email === '') { errors.push('Please enter an email address.'); } else
    if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email)) errors.push('Please enter a valid email address.');


    if (passwordOne === '') errors.push('Please enter a password');

    else if (passwordTwo === '') errors.push('Please re-enter your password.');

    else if (passwordOne.length < 6) { errors.push('Your password must be at least 6 characters in length.'); } else
    if (passwordOne !== passwordTwo) errors.push('Your two passwords don\'t match.');
    else if (!/^[\w]{6,20}$/.test(passwordOne)) { errors.push('Your password can only contain alphanumeric characters.'); }


    if (errors.length !== 0) { res.status(400).json({ status: 400, error: errors }); return; }

    next();
  },

  login(req, res, next) {
    req.values = {};
    Object.entries(req.body).forEach((input) => { req.values[input[0]] = input[1].trim(); });
    const { email, password } = req.values;
    const errors = [];

    if (email === '') errors.push('Please enter an email address.');
    else
    if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email)) { errors.push('Please enter a valid email address.'); }

    if (password === '') errors.push('Please enter a password');
    if (errors.length !== 0) { res.status(400).json({ status: 400, error: errors }); return; }

    next();
  },

  sendMessage(req, res, next) {
    req.values = {};
    Object.entries(req.body).forEach((input) => { req.values[input[0]] = input[1].trim(); });
    const { subject, message, receiver } = req.values;
    const errors = [];

    if (subject === '') { errors.push('Message must have a subject.'); }

    if (message === '') { errors.push('Please enter a message to send.'); }

    // check if the message is being sent to a group.
    if (!req.params.groupId) {
      if (receiver === '') { errors.push('Please enter the message recipient'); }
    }

    if (errors.length !== 0) { res.status(400).json({ status: 400, error: errors }); return; }

    next();
  },

  newGroup(req, res, next) {
    req.values = {};
    Object.entries(req.body).forEach((input) => { req.values[input[0]] = input[1].trim(); });
    const { name, description } = req.values;
    const errors = [];

    if (name === '') { errors.push('Please enter a group name.'); } else
    if (!/^[a-zA-Z0-9 ]{4,}$/.test(name)) errors.push('Please enter a valid first name');

    if (description === '') { errors.push('Please enter a group description.'); } else
    if (!/^[a-zA-Z0-9."';: ]{4,}$/.test(description)) errors.push('Please enter a valid description');

    if (errors.length !== 0) { res.status(400).json({ status: 400, error: errors }); return; }

    next();
  },
};

export default Validate;
