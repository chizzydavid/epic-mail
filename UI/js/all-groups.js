const feedback = document.querySelector('#feedback'),
	wait = document.querySelector('#loader'),
	token = localStorage.epicMailToken,
	msgContainer = document.querySelector('.message-container');


const loader = (msg) => {
	feedback.classList.add('hide');
	msg === 'show' ? wait.classList.remove('hide') : wait.classList.add('hide');
}

const displayFeedback = (message, status, err = true) => {
	loader('hide');
	feedback.className = status;
	feedback.innerHTML = message;
	feedback.scrollIntoView({behavior: "smooth", block: "end"});
}

const createGroup = (groupItem) => {
	const { group_id, name, description } = groupItem;
	const id = group_id,
	  	groupDesc = description.length > 70 ? `${description.substr(0, 70)}...` : description ;

	return `
		<div class="message" data-group-id="${id}">
			<h4 class="group-title">${name} </h4>
			<div class="msg-body"> 
				<p class="msg-excerpt">${groupDesc}</p>
				<div class="msg-details">
					<p><a id="${id}" class="view-group" href="view-group.html">View Details</a></p>
					<div class="msg-buttons">
						<i id="${id}" class="edit-group fa fa-edit"></i>
						<p class="hide"> ${description}</p>								
						<i id="${id}" class="delete-group fa fa-trash"></i>
					</div>         
				</div> 
			</div>
		</div>
   `
}

const displayGroups = (groups) => {
	loader('hide');
	msgContainer.innerHTML = '';

	groups.forEach(group => {
		const newGroup = createGroup(group);
		msgContainer.insertAdjacentHTML('beforeend', newGroup);		
	});
}

const fetchGroups = async () => {
	loader('show');
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
		else if (result.status === 200 && result.message !== undefined) {
			displayFeedback(result.message);
		}
		else if (result.status === 401) {
			displayFeedback('There was a problem getting your groups, please try again.');
		}
	} catch (e) {
		displayFeedback('There was a problem getting your groups, please try again.',)
	}
}

const viewGroup = async (e) => {
	e.preventDefault();
	localStorage.setItem('viewGroupId', e.target.id);
	location.href = location.href.replace('all-groups.html', 'view-group.html');
}

const deleteGroup = async (e) => {
	const group = e.target;
	let result = {};
	try { 
		const response = await fetch(`${url}groups/${group.id}`, {
			method: 'DELETE',
			headers: { 'Authorization': token }
		});
		result = await response.json();

		if (result.status === 200 && result.message !== undefined) {
			const groupPt = group.parentElement.parentElement.parentElement.parentElement;
			groupPt.classList.add('fadeout');
			groupPt.addEventListener('transitionend', (e) => {
				groupPt.parentElement.removeChild(groupPt)
			});
		}
	} catch (e) {
		displayInfo('There was a problem deleting this group, please try again.')
	}	
}

const editGroup = (e) => {
	const group = e.target;
	const name = group.parentElement.parentElement.parentElement.previousElementSibling.innerText,
	description = group.nextElementSibling.innerText,
	groupId = group.id;
	const editGroupData = JSON.stringify({groupId, name, description});
	localStorage.setItem('editGroupData', editGroupData);
	location.href = location.href.replace('all-groups.html', 'create-group.html')
}

const handleMsgContainerClick = (e) => {
	if (e.target.classList.contains('view-group'))
		viewGroup(e);	
		
	if (e.target.classList.contains('delete-group'))
		deleteGroup(e);
		
	if (e.target.classList.contains('edit-group'))
		editGroup(e);
}

const init = () => {
	isLoggedIn();
	fetchGroups();
	msgContainer.addEventListener('click', handleMsgContainerClick);
}

init();
