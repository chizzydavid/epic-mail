const messages = [
	{
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'Read Message One',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'read',
	},
	{
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'Read Message Two',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'read',
	},
	{
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'Unread Message One',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'unread',
	},
	{
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'Unread Message Two',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'unread',
	},
	{
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'Sent Message One',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'sent',
	},
	{
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'Draft Message Two',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'draft',
	},
	{ 
		"id" : 81901920,
		"createdOn" : 15637839,
		"subject" : 'Draft Message Two',
		"message" : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		"senderId" : 3427202,
		"receiverId" : 1173839,
		"parentMessageId" : 7368728,
		"status" : 'draft',
	}	
],
	messageBtns = document.querySelectorAll('.messages-nav li'),
	msgHeader = document.querySelector('.msg-header'),
	msgContainer = document.querySelector('.message-container'),
	wait = document.querySelector('#loader');

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
		msgContainer.insertAdjacentHTML('beforeend', 
			`<div class="message" data-message-id="${message.id}">
        <h4>${message.subject}</h4>

        <div class="msg-body"> 
          <p class="msg-excerpt">${message.message}</p>

          <div class="msg-details">
            <p>Status: <span class=msg-status>${message.status.toUpperCase()} </span></p>
            <div class="msg-buttons">
            	${message.status === 'draft' ? 
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
	if (e.target.tagName === 'LI') {
		messageBtns.forEach(btn => btn.classList.remove('active'));
		e.target.classList.add('active');
		getMessages(e.target.id);
	}
	else return;
}

function init() {
	loadMessages();
	document.querySelector('.messages-nav ul').addEventListener('click', messageBtnHandler);
}

init();

