const form = document.querySelector('#login-form'),
	feedback = document.querySelector('#form-feedback'),
	email = document.querySelector('#email'),
	password = document.querySelector('#password')


const displayFeedback = (message, status) => {
	feedback.classList.add(status);
	feedback.innerHTML = message;
	feedback.scrollIntoView({behavior: "smooth", block: "center"});
	throw'';
}

function validateInput(e) {
	e.preventDefault();

	if (email.value.trim() === '' || password.value.trim() === '')
		displayFeedback('Please enter all form fields.', 'fail');

	if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.value.trim()))
		displayFeedback('Please enter a valid email address', 'fail');
	
	sendUserData();
}

const sendUserData = async () => {
	const formData = new FormData(form);
	let data = {};
	let result = {};
	Array.from(formData.entries()).forEach(entry => data[entry[0]] = entry[1]);
	try {
		const response = await fetch(`${url}auth/login`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json'}
		});
		result = await response.json();
		if (result.status === 200) {

			localStorage.setItem('epicMailToken', result.data[0].token);
			localStorage.setItem('epicMailUserId', result.data[0].user.user_id);
			localStorage.setItem('epicMailUserPhoto', result.data[0].user.photo);
			location.href = location.href.replace('sign-in.html','view-inbox.html');
		}
		else if (result.status === 400 && Array.isArray(result.error)) {
			const errors = result.error.join('</br>');
			displayFeedback(errors, 'fail')
		}
		else if (result.status === 400 && result.error.includes('Invalid Login')) {
			displayFeedback('Invalid Login Credentials.', 'fail')
		}			
		else if (result.status === 400) {
			displayFeedback('There was a problem creating your account. Please try again.', 'fail')
		}
	} catch (e) {
		if (e.message === 'Failed to fetch')
			displayFeedback('There was a problem login you in, please try again.', 'fail');
			
	}
}

function eventListeners() {
	document.querySelector('#submit-login').addEventListener('click', validateInput);
	document.querySelectorAll('#login-form input').forEach(input => {
		input.addEventListener('focus', () => feedback.className = '');
	});
}

eventListeners();

