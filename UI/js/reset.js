const feedback = document.querySelector('#form-feedback'),
	  email = document.querySelector('#email');

//validate form fields when user submits the form
function validateInput(e) {
	e.preventDefault();

	if (email.value.trim() === '' )
		return displayFeedback('Please fill the form first.', 'fail');

	if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.value.trim()))
		return displayFeedback('Please enter a valid email address', 'fail');
	//send user data to the server
}

const displayFeedback = (message, status) => {
	feedback.classList.add(status);
	feedback.innerText = message;
}

function eventListeners() {
	document.querySelector('#submit').addEventListener('click', validateInput);
	document.querySelector('#email').addEventListener('focus', () => feedback.className = '');
	
}

eventListeners();

