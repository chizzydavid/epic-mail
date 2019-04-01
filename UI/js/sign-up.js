const feedback = document.querySelector('#form-feedback'),
	form = document.querySelector('#form'),
	inputFields = Array.from(document.querySelectorAll('.signup-input')),
	firstName = document.querySelector('#first-name'),
	secondName = document.querySelector('#second-name'),
	email = document.querySelector('#email'),
	password = document.querySelector('#password'),
	imgUpload = document.querySelector('#image-upload'),
	confirmPassword = document.querySelector('#confirm-password')
	url = `http://localhost:5000/api/v2/auth/signup`;


const displayFeedback = (message, status) => {
	feedback.classList.add(status);
	feedback.innerHTML = message;
	feedback.scrollIntoView({behavior: "smooth", block: "center"});
	throw'';
}
	  
const validateInput = (e) => {
	e.preventDefault();
	const nameRegx = /^[a-zA-Z]{2,}$/;
	//check for empty input fields
	for (let i = 0; i < inputFields.length; i++) {
		if (inputFields[i].value.trim() === '')
			displayFeedback('Please enter all required form fields.', 'fail');
	}
	if (!nameRegx.test(firstName.value.trim()) || !nameRegx.test(secondName.value.trim()))
	  displayFeedback('Please enter a valid name', 'fail');

	if (!/^\S+@\S+\.[a-zA-Z0-9]+$/.test(email.value.trim()))
	  displayFeedback('Please enter a valid email address', 'fail');

	if (password.value.trim() !== confirmPassword.value.trim())
	  displayFeedback('Your two passwords don\'t match', 'fail');
 
	if (password.value.trim().length < 6) 
	  displayFeedback('Your password must be at least 6 characters in length', 'fail');
  
	if (!/^[\w]{6,20}$/.test(password.value.trim())) 
	  displayFeedback('Your password can only contain alphanumeric characters.', 'fail');

	sendUserData();
}

const sendUserData = async () => {
	const formData = new FormData(form);
	try {
		const response = await fetch(`${url}`, {
			method: 'POST',
			body: formData,
			headers: { }
		});
		console.log(response);
		const result = await response.json();
		if (result.status === 201) {
			displayFeedback(`Your account was successfully created. </br> 
			Please <strong><a href="sign-in.html">Login.</a></strong> to continue.`, 'success')
		}
		else if (result.status === 400 && result.error.includes('Email already exists')) {
			displayFeedback(`This email address has already been registered.</br>
			If you already have an account, Please <strong><a href="sign-in.html">Login.</a></strong>`, 'success')
		}
		else if (result.status === 400 && result.error.includes('uploading image')) {
			displayFeedback('Please upload an image file less than 200kb in size.', 'fail')
		}
		else if (result.status === 400 && Array.isArray(result.error)) {
			const errors = result.error.join('</br>');
			displayFeedback(errors, 'fail')
		}		
		else if (result.status === 400) {
			displayFeedback('There was a problem creating your account. Please try again.', 'fail')
		}
	} catch (e) {
		console.log(`An error occured while creating your account. ${e || result.error}`);
	}
}

const evtListeners = () => {
	const imgPreview = document.querySelector('#image-preview');

	//set up image preview
	imgUpload.addEventListener('change', (e) => {
		imgPreview.src = URL.createObjectURL(e.target.files[0]);
		imgPreview.setAttribute('height', '150px');
		imgPreview.addEventListener('load', (e) => URL.revokeObjectURL(e.target.src));
	});
	imgUpload.addEventListener('click', (e) => { 
		imgPreview.src = ''; 
		imgPreview.setAttribute('height', '0') 
	});
	document.querySelector('#submit').addEventListener('click', validateInput);
	inputFields.forEach(input => {
		input.addEventListener('focus', () => feedback.className = '');
	});
}

evtListeners();


