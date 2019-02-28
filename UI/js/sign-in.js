const feedback = document.querySelector('#form-feedback'),
			email = document.querySelector('#email'),
			password = document.querySelector('#password');

//validate form fields when user submits the form
function validateInput(e) {
	e.preventDefault();

	if (email.value.trim() === '' || password.value.trim() === '')
		return displayFeedback('Please enter all form fields.', 'fail');

	if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.value.trim()))
		return displayFeedback('Please enter a valid email address', 'fail');
	//send user data to the server
}

const displayFeedback = (message, status) => {
	feedback.classList.add(status);
	feedback.innerText = message;
}

function eventListeners() {
	document.querySelector('#submit-login').addEventListener('click', validateInput);
	document.querySelectorAll('#login-form input').forEach(input => {
		input.addEventListener('focus', () => feedback.className = '');
	});
}

eventListeners();

