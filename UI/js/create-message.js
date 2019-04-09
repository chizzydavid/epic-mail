const form = document.querySelector('#send-message-form'),
	feedback = document.querySelector('#form-feedback'),
	wait = document.querySelector('#loader'),
	inputFields = Array.from(document.querySelectorAll('.message-input')),
	email = document.querySelector('#msg-recipient'),
	token = localStorage.epicMailToken,
	userId = localStorage.userId,	
	replyMessage = localStorage.replyMessageData,
	draftMessage = localStorage.draftMessageData,
	msgSubject = document.querySelector('#msg-subject');
	msgBody = document.querySelector('#msg-body');
	saveDraftBtn = document.querySelector('#save-draft'),
	sendMsgBtn = document.querySelector('#send-message'),
	groupSelect = document.querySelector('#select-group');

let parentMessageId = 0,
  msgIsDraft = false,
  draftId = 0;

const displayFeedback = (message, status, err = true) => {
	feedback.className = status;
	feedback.innerHTML = message;
	feedback.scrollIntoView({behavior: "smooth", block: "end"});
	if (err) throw Error('');
}

const displayGroups = (groups) => {
	if (!groups.length) {
		groupSelect.insertAdjacentHTML('beforeend', `<option value="">No Groups Available</option>`);
		return;
	}
	groupSelect.innerHTML = `<option value="">Select Group</option>`;
	groups.forEach(group => {
		let newGroupOption = `<option value="${group.group_id}">${group.name}</option>`
		groupSelect.insertAdjacentHTML('beforeend', newGroupOption);
	});
}

const setReplyParams = () => {
	if (replyMessage) {
		const { id, receiver } = JSON.parse(replyMessage);
		parentMessageId = id;
		email.value = receiver;
		msgSubject.focus();
		localStorage.removeItem('replyMessageData');

	}
	else return;
}

const setDraftParams = () => {
	if (draftMessage) {
		const {id, subject, message, receiver } = JSON.parse(draftMessage);
		console.log(id);
		draftId = Number(id);
	  msgIsDraft = true;
		email.value = receiver;
		msgSubject.value = subject
		msgBody.value = message;
		localStorage.removeItem('draftMessageData');
	}
	else return;
}

const populateForm = async () => {
	setReplyParams();
	setDraftParams();
	//fetch user's groups
	let result = {};
	try {
		const response = await fetch(`${url}groups`, {
			method: 'GET',
			headers: { 'Authorization': token }
		});
		result = await response.json();

		if (result.status === 200 && result.data !== undefined) {
			displayGroups(result.data);
		}
		else if (result.status === 401) {
			displayFeedback('There was a problem getting your groups, please try again.', 'fail', false);
		}

	} catch (e) {
		displayFeedback('There was a problem getting your groups, please refresh the page.', 'fail', false)
		console.log(`An error occured while fetching your messages. ${e || result.error}`);
	}
}

const sendDraft = async (e) => {
	e.preventDefault();
	const formData = new FormData(form);
	let data = {};
	let result = {};

	if (!email.value) {
		displayFeedback('Recipient\'s email address is required', 'fail', true);
	}
	if (!/^\S+@\S+\.[\w]+$/.test(email.value)) {
		  displayFeedback('Invalid email address for recipient', 'fail', true);
	}

	Array.from(formData.entries()).forEach(entry => data[entry[0]] = entry[1]);
	try {
		const response = await fetch(`${url}messages/draft`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': token,
			}
		});
		result = await response.json();
		
		if (result.status === 201) {
			displayFeedback('Draft saved successfully.', 'success', false);
		}
		else if (result.status === 400 && Array.isArray(result.error)) {
			const errors = result.error.join('</br>');
			displayFeedback(errors, 'fail');
		}
		else if (result.status === 401 && result.error.includes('Message recipient')) {
			displayFeedback('Message recipient is not a registered user.', 'fail', false)
		}			
	} catch (e) {
		displayFeedback(`There was a problem saving your draft, please try again. ${e}`, 'fail', true);
			
		console.log(`An error occured while saving your draft. ${e || result.error}`);
	}
}

const sendMessage = async (e) => {
	e.preventDefault();
	let data = {}, result = {};	
	const formData = new FormData(form);
	if (!parentMessageId) formData.append('parentMessageId', parentMessageId);

	if (!msgSubject.value.trim() && !msgBody.value.trim()) {
		displayFeedback('Message should have a subject and a body.', 'fail');
	}

	if (!email.value.trim() && !groupSelect.value.trim()) {
		displayFeedback('Message should have a recipient', 'fail');
	}

	if (email.value.trim() && !groupSelect.value.trim()) {
		if (!/^\S+@\S+\.[\w]+$/.test(email.value))
	  	displayFeedback('Invalid email address for recipient', 'fail');
	}

	if (email.value !== "" && groupSelect.value !== "") {
		displayFeedback('You can\'t send a message to both an individual and a group', 'fail');
	}

	Array.from(formData.entries()).forEach(entry => data[entry[0]] = entry[1].trim());
	try {
		const response = await fetch(`${url}messages`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': token,
			}
		});
		console.log(response);
		result = await response.json();
		console.log(result);
		
		if (result.status === 201) {
			displayFeedback('Message sent successfully.', 'success', false);
			console.log(msgIsDraft, draftId);
			if (msgIsDraft && draftId) {
				const res = await fetch(`${url}messages/sent/${draftId}`, {
					method: 'DELETE',
					headers: { 'Authorization': token }
				});
				console.log(res);
				const ress = await res.json();
				console.log(ress);

			}
		}

		else if (result.status === 400 && Array.isArray(result.error)) {
			const errors = result.error.join('</br>');
			displayFeedback(errors, 'fail', false);
		}

		else if (result.status === 401 && result.error.includes('Message recipient')) {
			displayFeedback('Message recipient is not a registered user.', 'fail', false)
		}

	} catch (e) {
		displayFeedback(`There was a problem saving your draft, please try again. ${e}`, 'fail');
		console.log(`An error occured while saving your draft. ${e || result.error}`);
	}  
}

const init = () => {
	isLoggedIn();
	populateForm();
	inputFields.forEach(input => {
		input.addEventListener('focus', () => feedback.className = '');
	});
	saveDraftBtn.addEventListener('click', sendDraft);
	sendMsgBtn.addEventListener('click', sendMessage);
}

init();
