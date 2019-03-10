const Validate = {
  signUp(req, res, next) {
    const {
      firstName, lastName, email, passwordOne, passwordTwo,
    } = req.body;
    const errors = [];

    const nameRegx = /^[a-zA-Z]{2,}$/;

    if (firstName.trim() === '') { errors.push('Please enter a first name updated version.'); } else
    if (!nameRegx.test(firstName)) errors.push('Please enter a valid first name');

    if (lastName.trim() === '') { errors.push('Please enter a last name.'); } else
    if (!nameRegx.test(lastName)) errors.push('Please enter a valid last name.');

    if (email.trim() === '') { errors.push('Please enter an email address.'); } else
    if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.trim())) errors.push('Please enter a valid email address.');


    if (passwordOne.trim() === '') errors.push('Please enter a password');

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

    if (email.trim() === '') errors.push('Please enter an email address.');
    else
    if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.trim())) { errors.push('Please enter a valid email address.'); }

    if (password.trim() === '') errors.push('Please enter a password');

    if (errors.length !== 0) { res.status(400).json({ status: 400, error: errors }); return; }

    next();
  },

  sendMessage(req, res, next) {
    const {
      subject, message, senderId, receiverId,
    } = req.body;
    const errors = [];

    if (subject.trim() === '') { errors.push('Message must have a subject.'); }

    if (message.trim() === '') { errors.push('Please enter a message to send.'); }

    if (senderId === '') { errors.push('No sender specified.'); }

    if (receiverId === '') { errors.push('Please enter the message recipient'); }


    if (errors.length !== 0) { res.status(400).json({ status: 400, error: errors }); return; }

    next();
  },
};

export default Validate;
