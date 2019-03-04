const feedback = document.querySelector('#form-feedback'),
			inputFields = Array.from(document.querySelectorAll('.signup-input')),
			firstName = document.querySelector('#first-name'),
		  secondName = document.querySelector('#second-name'),
		  email = document.querySelector('#email'),
		  passwordOne = document.querySelector('#password'),
		  passwordTwo = document.querySelector('#confirm-password');
		  
function validateInput(e) {
	//e.preventDefault();
	let nameRegx = /^[a-zA-Z]{2,}$/;
	//check for empty input fields
	for (let i = 0; i < inputFields.length; i++) {
		if (inputFields[i].value.trim() === '')
			return displayFeedback('Please enter all form fields.', 'fail');
	}
	if (!nameRegx.test(firstName.value.trim()) || !nameRegx.test(secondName.value.trim()))
		return displayFeedback('Please enter a valid name', 'fail');

	if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.value.trim()))
		return displayFeedback('Please enter a valid email address', 'fail');

	if (passwordOne.value.trim() !== passwordTwo.value.trim())
		return displayFeedback('Your two passwords don\'t match', 'fail');

	if (passwordOne.value.trim().length < 6) 
		return displayFeedback('Your password must be at least 6 characters in length', 'fail');

	if (!/^[\w]{6,20}$/.test(passwordOne.value.trim())) 
		return displayFeedback('Your password can only contain alphanumeric characters.', 'fail');

	//send user data to the server
}

const displayFeedback = (message, status) => {
	feedback.classList.add(status);
	feedback.innerText = message;
}

function eventListeners() {
	const imgPreview = document.querySelector('#image-preview');

	//set up image preview for when a user uploads his picture
	document.querySelector('#image-upload').addEventListener('change', (e) => {
		imgPreview.src = URL.createObjectURL(e.target.files[0]);
		imgPreview.setAttribute('height', '150px');
		imgPreview.addEventListener('load', (e) => URL.revokeObjectURL(e.target.src));
	});

	//document.querySelector('#submit').addEventListener('click', validateInput);
	document.querySelectorAll('#form input').forEach(input => {
		input.addEventListener('focus', () => feedback.className = '');
	})
}


eventListeners();


