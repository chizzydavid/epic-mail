const form = document.querySelector('#send-message-form');
	const feedback = document.querySelector('#form-feedback');
	const wait = document.querySelector('#loader');
	const email = document.querySelector('#msg-recipient');
	const token = localStorage.epicMailToken;
	const replyMessage = localStorage.replyMessageData;
	const draftMessage = localStorage.draftMessageData;
	const msgSubject = document.querySelector('#msg-subject');
	const msgBody = document.querySelector('#message-body');
	const groupSelect = document.querySelector('#select-group');

let parentMessageId = 0;
	let msgIsDraft = false;
	let sendMessageToGroupId = localStorage.sendMessageToGroupId;
	let draftId = 0;

const displayFeedback = (message, status, err = true) => {
  feedback.className = status;
  feedback.innerHTML = message;
  feedback.scrollIntoView({ behavior: 'smooth', block: 'end' });
  if (err) throw Error('');
};

const displayGroups = (groups) => {
  groupSelect.innerHTML = '<option value="">Select Group</option>';

  groups.forEach((group) => {
    const newGroupOption = `<option value="${group.group_id}">${group.name}</option>`;
    groupSelect.insertAdjacentHTML('beforeend', newGroupOption);
  });
  setMessageToGroup();
};

const setReplyParams = () => {
  if (replyMessage) {
    const { msgId, receiver } = JSON.parse(replyMessage);
    parentMessageId = msgId;
    email.value = receiver;
    msgSubject.focus();
    localStorage.removeItem('replyMessageData');
  } else return;
};

const setDraftParams = () => {
  if (draftMessage) {
    const { id, subject, message, receiver } = JSON.parse(draftMessage);
    const recipient = receiver === 'null' ? '' : receiver;
    draftId = Number(id);
    msgIsDraft = true;
    // insert draft values into the form fields
    [email.value, msgSubject.value, msgBody.value] = [recipient, subject, message];
    localStorage.removeItem('draftMessageData');
  } else return;
};

const setMessageToGroup = () => {
  // if the message is to be sent to a group, select the group
  // and disable input field for single recipients
  if (sendMessageToGroupId) {
    const id = localStorage.sendMessageToGroupId;
    document.querySelector('#msg-recipient').disabled = true;
    msgSubject.focus();
    groupSelect.value = id;
    localStorage.removeItem('sendMessageToGroupId');
  } else return;
};

const populateForm = async () => {
  setReplyParams();
  setDraftParams();

  // fetch user's groups
  let result = {};
  try {
    const response = await fetch(`${url}groups`, {
      method: 'GET',
      headers: { Authorization: token },
    });
    result = await response.json();

    if (result.status === 200 && result.data !== undefined) {
      displayGroups(result.data);
    }
    if (result.status === 200 && result.message !== undefined) {
      groupSelect.insertAdjacentHTML('beforeend', '<option value="">No Groups Available</option>');
    } else if (result.status === 401) {
      displayFeedback('There was a problem getting your groups, please refresh the page.', 'fail', false);
    }
  } catch (e) {
    displayFeedback('There was a problem getting your groups, please refresh the page.', 'fail', false);
  }
};

const sendDraft = async (e) => {
  e.preventDefault();
  feedback.className = '';
  const formData = new FormData(form);
  const data = {};
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
        Authorization: token,
      },
    });
    result = await response.json();

    if (result.status === 201) {
      displayFeedback('Draft saved successfully.', 'success', false);
    } else if (result.status === 400 && Array.isArray(result.error)) {
      const errors = result.error.join('</br>');
      displayFeedback(errors, 'fail');
    } else if (result.status === 401 && result.error.includes('Message recipient')) {
      displayFeedback('Message recipient is not a registered user.', 'fail', false);
    }
  } catch (e) {
    displayFeedback('There was a problem saving your draft, please try again', 'fail');
  }
};

const validateMessage = () => {
  if (!msgSubject.value.trim() && !msgBody.value.trim()) {
    displayFeedback('Message should have a subject and a body.', 'fail');
  }
  if (!email.value.trim() && !groupSelect.value.trim()) {
    displayFeedback('Message should have a recipient', 'fail');
  }
  if (email.value.trim() && !groupSelect.value.trim()) {
    if (!/^\S+@\S+\.[\w]+$/.test(email.value)) {displayFeedback('Invalid email address for recipient', 'fail');}
  }
  if (email.value !== '' && groupSelect.value !== '') {
    displayFeedback('You can\'t send a message to both an individual and a group', 'fail');
  }
  if (groupSelect.value) sendMessageToGroupId = groupSelect.value;
};

const sendMessage = async (e) => {
  e.preventDefault();
  feedback.className = '';
  let data = {}; 
  let result = {};
  const formData = new FormData(form);

  if (Number(parentMessageId))
    {formData.append('parentMessageId', parentMessageId);}

  validateMessage();

  Array.from(formData.entries())
    .forEach(entry => data[entry[0]] = entry[1].trim());

  const query = sendMessageToGroupId ? `groups/${sendMessageToGroupId}/messages` : 'messages';
  try {
    const response = await fetch(`${url}${query}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    result = await response.json();

    if (result.status === 201) {
      displayFeedback('Message sent successfully.', 'success', false);
      if (msgIsDraft && draftId) {
        const res = await fetch(`${url}messages/sent/${draftId}`, {
          method: 'DELETE',
          headers: { Authorization: token },
        });
        await res.json();
      }
    } else if (result.status === 200 && result.message !== undefined) {
      displayFeedback(result.message, 'fail', false);
    } else if (result.status === 400 && Array.isArray(result.error)) {
      const errors = result.error.join('</br>');
      displayFeedback(errors, 'fail', false);
    } else if (result.status === 401 && result.error.includes('Message recipient')) {
      displayFeedback('Message recipient is not a registered user.', 'fail', false);
    }
  } catch (e) {
    displayFeedback('There was a problem sending this message, please try again', 'fail');
  }
};

const init = () => {
  isLoggedIn();
  populateForm();
  Array.from(document.querySelectorAll('.message-input')).forEach((input) => {
    input.addEventListener('focus', () => feedback.className = '');
  });
  document.querySelector('#save-draft').addEventListener('click', sendDraft);
  document.querySelector('#send-message').addEventListener('click', sendMessage);
};

init();
