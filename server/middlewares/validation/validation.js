const Validate = {
  signUp(req, res, next) {
    const { firstName, lastName, email, passwordOne, passwordTwo } = req.body;
    let errors = [];

    const nameRegx = /^[a-zA-Z]{2,}$/;

    firstName.trim() === '' ? errors.push('Please enter a first name updated version.') :
      !nameRegx.test(firstName) ? errors.push('Please enter a valid first name') : '';

    lastName.trim() === '' ? errors.push('Please enter a last name.') :
      !nameRegx.test(lastName) ? errors.push('Please enter a valid last name.') : '';

    email.trim() === '' ? errors.push('Please enter an email address.') : 
      !/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.trim()) ? errors.push('Please enter a valid email address.') : '';


    passwordOne.trim() === '' ? errors.push('Please enter a password') : 
      
      passwordTwo.trim() === '' ? errors.push('Please re-enter your password.') :

        passwordOne.trim().length < 6 ? errors.push('Your password must be at least 6 characters in length.') :

          passwordOne.trim() !== passwordTwo.trim() ? errors.push('Your two passwords don\'t match.') : 
          
            !/^[\w]{6,20}$/.test(passwordOne.trim()) ? errors.push('Your password can only contain alphanumeric characters.') : '';              


    if (errors.length !== 0) 
      return res.status(400).json({ 'status': 400, 'error': errors });
    
    next();
  },

  login(req, res, next) {
    const { email, password } = req.body;
    let errors = [];

    email.trim() === '' ? errors.push('Please enter an email address.') : 
      !/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.trim()) ? errors.push('Please enter a valid email address.') : '';

    password.trim() === '' ? errors.push('Please enter a password') : '';

    if (errors.length !== 0) 
      return res.status(400).json({ 'status': 400, 'error': errors });
    
    next();
  },

  sendMessage(req, res, next) {
    const { subject, message, senderId, receiverId } = req.body;
    let errors = [];

    subject.trim() === '' ? errors.push('Message must have a subject.') : '';

    message.trim() === '' ? errors.push('Please enter a message to send.') : '';

    senderId === '' ? errors.push('No sender specified.') : '';

    receiverId === '' ? errors.push('Please enter the message recipient') : '';              


    if (errors.length !== 0) 
      return res.status(400).json({ 'status': 400, 'error': errors });
    
    next();
  },
}

export default Validate;
