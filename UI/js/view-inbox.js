const feedback = document.querySelector('#feedback'),
	messageBtns = document.querySelectorAll('.messages-nav li'),
	msgHeader = document.querySelector('.msg-header'),
	msgContainer = document.querySelector('.message-container'),
	wait = document.querySelector('#loader'),
	inboxNav = document.querySelector('#nav-wrapper'),
	inboxNavBtn = document.querySelector('#inbox-nav-btn'),
	msgCount = document.querySelector('#msg-count'),
	token = localStorage.epicMailToken,
	userId = localStorage.epicMailUserId;

const loader = (msg) => {
	feedback.classList.add('hide');
	msg === 'show' ? wait.classList.remove('hide') : wait.classList.add('hide')
}

const displayFeedback = (message) => {
	loader('hide');
	feedback.classList.remove('hide');
	msgContainer.innerHTML = '';
	feedback.innerHTML = message;
	feedback.scrollIntoView({behavior: "smooth", block: "end"});
}

const createMessage = (messageItem) => {
	const { message_id, subject, email, sender_id, message, status, photo } = messageItem;
	const id = message_id;
	const msgBody = message.length >= 70 ? `${message.substr(0, 70)}...` : message;
	const type = Number(userId) === sender_id ? 'sent' : 'received';
	const msgStatus = status.replace(status[0], status[0].toUpperCase());
	const userImg = `${imgUrl}${photo === undefined ? localStorage.epicMailUserPhoto : photo}`;

	return `
		<div class="message" data-message-id="${id}" data-message-type="${type}" data-message-status="${status}">

			<div class="message-img">
				<img src="${userImg}" id="msg-sender-img"/>
			</div>
		
			<div class="message-text">
				<h4 class="message-title ${status == 'unread' ? 'unread' : ''} ">${subject}	</h4>
	
				<div class="msg-body"> 
					<p class="msg-excerpt">${msgBody}</p>
					<div class="msg-details">
						<p>Status: <span class="status-${status} msg-status">${msgStatus} </span> </p>
						<div class="msg-buttons">
							${status === 'draft' ? 
							'<i id="' + `${id}` + '" data-draft-receiver="' + `${email}` + '" class="edit-draft fa fa-edit"></i>' +
							'<p class="hide">' + `${message}` + '</p>' : ''  }
							
							${type === 'sent' && status !== 'draft' ?
							'<i id="' + `${id}` + '" class="retract-message fa fa-undo"></i>' : ''  }
							<i id="${id}" data-message-type="${type}" class="delete-message fa fa-trash"></i>
						</div>            
					</div> 
				</div>    
			</div>
		</div>
   `
}

const displayMessages = (messages) => {
	loader('hide');
	msgContainer.innerHTML = '';

	messages.forEach(message => {
		const newMessage = createMessage(message);
		msgContainer.insertAdjacentHTML('beforeend', newMessage);		
	});
}
		
const fetchMessages = async (query) => {
	loader('show');
	const category = query === 'all' ? '' : query;
	let result = {};
	try {
		const response = await fetch(`${url}messages/${category}`, {
			method: 'GET',
			headers: { 'Authorization': token }
		});
		result = await response.json();

		if (result.status === 200 && result.data !== undefined) {
			if (result.newMsgCount !== undefined) {
				localStorage.newMsgCount = result.newMsgCount;
				msgCount.innerText = result.newMsgCount;
			}
			displayMessages(result.data);
		}
		else if (result.status === 200 && result.message !== undefined) {
			displayFeedback(result.message)
		}
		else if (result.status === 401) {
			displayFeedback('There was a problem getting your messages, please try again.');
		}

	} catch (e) {
		displayFeedback('There was a problem getting your messages, please try again.')
	}
}

const messageBtnHandler = (e) => {
	let el = e.target;

	if (el.tagName === 'LI' || el.tagName === 'I') {
		const category = el.id || el.parentElement.id;
		fetchMessages(category);
		messageBtns.forEach(btn => btn.classList.remove('active'));
		const newHeader = category.replace(category[0], category[0].toUpperCase());
		msgHeader.innerText = 
			`${newHeader}${category === 'draft' ? 's' : category === 'all' ? ' Received Messages': ' Messages'}`;

		if (window.innerWidth <= 760) {
			messageBtns.forEach(btn => btn.classList.add('hide'));
			inboxNavBtn.click();
			el.tagName === 'LI' ? el.classList.remove('hide') : el.parentElement.classList.remove('hide');
		}

		el.tagName === 'LI' ? el.classList.add('active') : el.parentElement.classList.add('active');
	}
	
	else return;
}

const inboxNavBtnHandler = (e) => {
	let el = e.target;
	
	if (el.classList.contains('fa-caret-down')) {
		el.className = 'fa fa-caret-up';
		inboxNav.style.height  = '220px';
		messageBtns.forEach(btn => btn.classList.remove('hide'));		
	}
	else {
		el.className = 'fa fa-caret-down';
		inboxNav.style.height = '46px';
		messageBtns.forEach(btn => {
			if (!btn.classList.contains('active')) btn.classList.add('hide');		
		});
	}
}

const handleNavResize = () => {
	if (window.innerWidth > 760) {
		messageBtns.forEach(btn => btn.classList.remove('hide'));
	}
	else {
		messageBtns.forEach(btn => {
			if (!btn.classList.contains('active')) btn.classList.add('hide');		
		});		
	}
}

const viewMessage = async (e) => {
	try {
		const msg = e.target,
		  msgId = msg.parentElement.parentElement.getAttribute('data-message-id'),
		  msgType = msg.parentElement.parentElement.getAttribute('data-message-type'); 

		//If message is a received-message and if its unread, send a request to update its status to 'read'
		if (msg.classList.contains('unread') && msgType === 'received') {
			const response = await fetch(`${url}messages/${msgId}`, {
				method: 'PATCH',
				headers: { 'Authorization': token }
			});
			localStorage.newMsgCount = 
				localStorage.newMsgCount == 0 ? 0 : localStorage.newMsgCount - 1;
			 
			msgCount.innerText = localStorage.newMsgCount;
		}
		localStorage.setItem('viewMessageId', msgId);
		location.href = location.href.replace('view-inbox.html', 'view-message.html');
	} catch(e) {
		displayInfo(`An error occured while processing your request, please try again.`);
	}
}

const retractMessage = async (e) => {
	const msg = e.target;
	let result = {};
	try { 
		const response = await fetch(`${url}messages/retract/${msg.id}`, {
			method: 'DELETE',
			headers: { 'Authorization': token }
		});
		result = await response.json();

		if (result.status === 200 && result.message !== undefined) {
			const message = msg.parentElement.parentElement.parentElement.parentElement;
			message.classList.add('fadeout');

			message.addEventListener('transitionend', (e) => {
				message.parentElement.removeChild(message);
				displayInfo('Message Retracted');
			});
		}

		else if (result.error !== undefined) {
			displayInfo('There was a problem deleting this message, please try again.'); 
		}		

	} catch (e) {
		displayInfo('There was a problem retracting this message, please try again.')
	}	
}

const deleteMessage = async (e) => {
	const msg = e.target;
	let result = {};
	const query = msg.getAttribute('data-message-type') === 'sent' ? `sent/${msg.id}` : `${msg.id}`;
	try { 
		const response = await fetch(`${url}messages/${query}`, {
			method: 'DELETE',
			headers: { 'Authorization': token }
		});
		result = await response.json();

		if (result.status === 200 && result.message !== undefined) {
			const message = msg.parentElement.parentElement.parentElement.parentElement;
			message.classList.add('fadeout');

			message.addEventListener('transitionend', (e) => {
				message.parentElement.removeChild(message);
			});
		}
		else if (result.error !== undefined) {
			displayInfo('There was a problem deleting this message, please try again.'); 
		}	
	
	} catch (e) {
		displayInfo('There was a problem deleting this message, please try again.')
	}	
}

const editDraft = (e) => {
	const draft = e.target;
	const subject = draft.parentElement.parentElement.parentElement.previousElementSibling.innerText,
	message = draft.nextElementSibling.innerText,
	receiver = draft.getAttribute('data-draft-receiver'),
	id = draft.id;
	
	const draftMessageData = JSON.stringify({id, subject, message, receiver});
	localStorage.setItem('draftMessageData', draftMessageData);
	location.href = location.href.replace('view-inbox.html', 'create-message.html')
}

const handleMsgContainerClick = (e) => {
	if (e.target.classList.contains('message-title'))
		viewMessage(e);

	if (e.target.classList.contains('retract-message'))
		retractMessage(e);	
		
	if (e.target.classList.contains('delete-message'))
		deleteMessage(e);
		
	if (e.target.classList.contains('edit-draft'))
		editDraft(e);
}

function init() {
	isLoggedIn();
	fetchMessages('all');
	document.querySelector('.messages-nav ul').addEventListener('click', messageBtnHandler);
	inboxNavBtn.addEventListener('click', inboxNavBtnHandler);
	window.addEventListener('resize', handleNavResize);
	msgContainer.addEventListener('click', handleMsgContainerClick);
}

init();

