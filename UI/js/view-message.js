const feedback = document.querySelector('#feedback'),
	msgContainer = document.querySelector('.message-container'),
	token = localStorage.epicMailToken,
	userId = localStorage.userId,
	messageId = localStorage.viewMessageId;

const createMessage = (messageItem) => {
	const { 
		message_id, created_at, subject, first_name, last_name, email, sender_id, message, status 
	} =	 messageItem;

	const id = message_id,
		time = created_at.replace(/:[\d]+ pm/, 'pm'),
		type = Number(userId) === sender_id ? 'sent' : 'received',
		senderAtTime = `From <strong>${first_name} ${last_name}</strong> at ${time}`;

	return `
		<div class="group view ${type}" data-message-id="${id}" data-message-type="${type}" data-message-status="${status}">
			<h4 class="message-title"> ${subject}</h4>
			<p class="msg-from">${senderAtTime}</p>
			<div class="msg-body"> 
				<p class="msg-excerpt">${message}</p>
						
				<div class="msg-details">
					<div class="msg-buttons">
						${status === 'draft' ? 
						'<i id="' + `${id}` + '" class="edit-message fa fa-edit"></i>' +
						'<i id="' + `${id}` + '" class="send-message fa fa-send"></i>' : ''  }

						${type === 'received' ?
						'<i id="' + `${id}` + '" data-message-receiver="' + `${email}` + '" class="reply-message fa fa-reply"></i> ' : '' }
						<i id="${id}" data-message-type="${type}" class="delete-message fa fa-trash"></i>
					</div>  
									
				</div> 
			</div>
		</div>		
	`
}

const displayMessages = (messages) => {
	msgContainer.innerHTML = '';

	messages.forEach(message => {
		const newMessage = createMessage(message);
		msgContainer.insertAdjacentHTML('beforeend', newMessage);		
	});
}
		
const fetchMessage = async () => {
	let result = {};
	try {
		const response = await fetch(`${url}messages/${messageId}`, {
			method: 'GET',
			headers: { 'Authorization': token }
		});
		result = await response.json();

		if (result.status === 200 && result.data !== undefined) {
			displayMessages(result.data);
		}
		else if (result.status === 200 && result.message !== undefined) {
			displayFeedback(result.message)
		}
		else if (result.status === 401) {
			displayFeedback('There was a problem getting your messages, please try again.');
		}

	} catch (e) {
		displayInfo('There was a problem getting your messages, please try again.')
	}
}

const deleteMessage = async (e) => {
	const msg = e.target;
	const query = msg.getAttribute('data-message-type') === 'sent' ? `sent/${msg.id}` : `${msg.id}`;
	try { 
		const response = await fetch(`${url}messages/${query}`, {
			method: 'DELETE',
			headers: { 'Authorization': token }
		});
		result = await response.json();

		if (result.status === 200 && result.data !== undefined) {
			displayMessages(result.data);
		}
		else if (result.status === 200 && result.message !== undefined) {
			const message = msg.parentElement.parentElement.parentElement.parentElement;
			message.parentElement.removeChild(message);
		}		
	} catch (e) {
		displayInfo('There was a problem deleting this message, please try again.')
	}	
}

const replyMessage = (e) => {
	const msg = e.target;
	const [msgId, receiver] = [msg.id, msg.getAttribute('data-message-receiver')];
	const replyMessageData = JSON.stringify({msgId, receiver});

	localStorage.setItem('replyMessageData', replyMessageData);
	location.href = location.href.replace('view-message.html', 'create-message.html');
}

const handleMsgContainerClick = (e) => {
	if (e.target.classList.contains('delete-message'))
		deleteMessage(e);
		
	if (e.target.classList.contains('reply-message')) 
		replyMessage(e);
}

const init = () => {
	isLoggedIn();
	if (messageId !== undefined || messageId !== "") 
		fetchMessage();
	else 
		location.href = location.href.replace('view-message.html', 'view-inbox.html');
		
	msgContainer.addEventListener('click', handleMsgContainerClick);
}

init();



