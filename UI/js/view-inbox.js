const messages = [
	{
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'Hello Epic Mail',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'read',
	},
	{
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'Let\'s Meet Up Next Week',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'read',
	},
	{
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'Reply My Last Message',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'unread',
	},
	{
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'Send Me Your House Address',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'unread',
	},
	{
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'You Still Owe Me',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'sent',
	},
	{
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'My House Address',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'draft',
	},
	{ 
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'Next Week isn\'t Okay For Me',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'draft',
	}],
	messageBtns = document.querySelectorAll('.messages-nav li'),
	msgHeader = document.querySelector('.msg-header'),
	msgContainer = document.querySelector('.message-container'),
	wait = document.querySelector('#loader');
const inboxNav = document.querySelector('#nav-wrapper');
const inboxNavBtn = document.querySelector('#inbox-nav-btn');


function loader(msg) {
	msg === 'show' ? wait.classList.remove('hide') : wait.classList.add('hide')
}


function displayMessages(data) {
	loader('hide');
	msgContainer.innerHTML = '';
	if (data.messages.length === 0) {
		msgContainer.innerHTML = `<p class="msg-body">You have no ${data.category} messages</p>`;
		return;
	}

	data.messages.forEach(message => {
		const { id, subject, status } = message;

		msgContainer.insertAdjacentHTML('beforeend', 
			`<div class="message" data-message-id="${id}">
        <h4 class="message-title ${status == 'unread' ? 'unread' : ''} ">
        	<a href="view-message.html">${subject}</a>
        </h4>

        <div class="msg-body"> 
          <p class="msg-excerpt">${message.message}</p>

          <div class="msg-details">
            <p>Status: <span class="status-${status} msg-status">
            	${status.replace(status.charAt(0), status.charAt(0).toUpperCase())} </span>
            </p>
            <div class="msg-buttons">
            	${status === 'draft' ? 
            		'<i id="" class="edit-message fa fa-edit"></i>' +
            	  '<i id="" class="send-message fa fa-send"></i>' : 
                '<i id="" class="share-message fa fa-share"></i> '
              }
              <i id="" class="delete-message fa fa-trash"></i>
            </div>            
          </div>  

        </div>
      </div>
      `)		
	});
}

function loadMessages(query = '') {
	loader('show');

	//load messages from data objects stored in memory
	//query/category is 'all' by default
	const category = query === '' ? 'all' : query,
		sorted = category === 'all' ? messages : messages.filter(message => message.status === query);

	displayMessages({category, messages: sorted});
	//update header of the page depending on category of message
	const newHeader = category.replace(category.charAt(0), category.charAt(0).toUpperCase());
	msgHeader.innerText = `${newHeader}${category === 'draft' ? 's' : ' Messages'}`;
}

function getMessages(category) {
	//request different message categories depending on the button clicked
	switch(category) {
		case 'unread':
			loadMessages('unread');
			break;

		case 'read':
			loadMessages('read')
			break;

		case 'sent':
			loadMessages('sent');
			break;

		case 'draft':
			loadMessages('draft');
			break;

		default:
			loadMessages();
	}
}

function messageBtnHandler(e) {
	let el = e.target;
	if (el.tagName === 'LI' || el.tagName === 'I') {
		messageBtns.forEach(btn => btn.classList.remove('active'));


		if (el.tagName === 'LI') {
			if (window.innerWidth <= 760) {
				messageBtns.forEach(btn => btn.classList.add('hide'));
				inboxNavBtn.click();
				el.classList.remove('hide');
			}
			el.classList.add('active');
			getMessages(el.id)

		} else {
			messageBtns.forEach(btn => btn.classList.add('hide'));
			inboxNavBtn.click();
			el.parentElement.classList.remove('hide');
			el.parentElement.classList.add('active');
			getMessages(el.parentElement.id);
		}
	}
	else return;
}


function inboxNavBtnHandler(e) {
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
			if (!btn.classList.contains('active'))  btn.classList.add('hide');		
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


function init() {
	loadMessages();
	document.querySelector('.messages-nav ul').addEventListener('click', messageBtnHandler);
	inboxNavBtn.addEventListener('click', inboxNavBtnHandler);
	window.addEventListener('resize', handleNavResize);
}

init();

