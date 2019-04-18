const feedback = document.querySelector('#group-feedback'),
	wait = document.querySelector('#loader'),
	groupCont = document.querySelector('.group-container'),
	addMemberForm = document.querySelector('#add-member-form'),
	showMemberBtn = document.querySelector('#show-member-btn'),
	memberList = document.querySelector('.group-members'),
	userList = document.querySelector('.member-list-wrapper'),
	token = localStorage.epicMailToken,
	groupId = localStorage.viewGroupId;

const displayFeedback = (message, status, err = true) => {
	feedback.className = status;
	feedback.innerHTML = message;
	feedback.scrollIntoView({behavior: "smooth", block: "center"});
	setTimeout(() => {
		feedback.innerHTML = '';
		feedback.className = 'hide';
	}, 4000);
	if (err) throw Error('');
}

const displayGroup = (groupItem) => {
	const { group_id, name, description} = groupItem[0],
	  members = groupItem[1],
	  users = groupItem[2];

	groupCont.querySelector('h3').innerText = name;
	groupCont.querySelector('.msg-excerpt').innerText = description;
	groupCont.querySelector('#edit-group').setAttribute('data-group-id', group_id);
	groupCont.querySelector('#delete-group').setAttribute('data-group-id', group_id);

	const memberIds = [];
	if (!members.length)
		memberList.innerHTML = '<p class="member-feedback">This group has no members.</p>';
	
	members.forEach(member => {
		const { user_id, email, first_name, last_name } = member;
		//get each members id so they can be checked of the main user list
		memberIds.push(user_id);
		const newMember = 
			`<p class="member">
				<span>${first_name} ${last_name}</span> 
				<i id="${user_id}" class="delete-member fa fa-trash"></i>
			</p>`;

	    memberList.insertAdjacentHTML('beforeend', newMember);
	});

	users.forEach(user => {
		const { user_id, first_name, last_name } = user;
		const newUser = `<p><input type="checkbox" value="${user_id}" >${first_name} ${last_name} </p>`;
	  userList.insertAdjacentHTML('beforeend', newUser);
	});

	memberIds.forEach(id => userList.querySelector(`input[value='${id}']`).checked = true);

}
		
const fetchGroup = async () => {
	let result = {};
	try {
		const response = await fetch(`${url}groups/${groupId}`, {
			method: 'GET',
			headers: { 'Authorization': token }
		});
		result = await response.json();

		const userResponse = await fetch(`${url}users`, {
			method: 'GET',
			headers: { 'Authorization': token }
		});
		const userResult = await userResponse.json();

		if (result.status === 200 && userResult.status === 200) {
			result.data.push(userResult.data);
			displayGroup(result.data);
		}
		else if (result.status === 401) {
			displayInfo('There was a problem loading this group, please try again.', 3000);
		}

	} catch (e) {
		displayInfo('There was a problem getting this group, please refresh the page.', 5000)
	}
}

const deleteGroup = async (e) => {
	if (!Number(e.target.getAttribute('data-group-id'))) return;

	let result = {};
	try { 
		const response = await fetch(`${url}groups/${groupId}`, {
			method: 'DELETE',
			headers: { 'Authorization': token }
		});
		result = await response.json();
		if (result.status === 200 && result.message !== undefined) {
			location.href = location.href.replace('view-group.html', 'all-groups.html')
		}
	} catch (e) {
		displayInfo('There was a problem deleting this group, please try again.', 3000)
	}
}

const editGroup = (e) => {
	if (!Number(e.target.getAttribute('data-group-id'))) return;
	
	const name = groupCont.querySelector('h3').innerText,
	description = groupCont.querySelector('.msg-excerpt').innerText;
	const editGroupData = JSON.stringify({groupId, name, description});
	localStorage.setItem('editGroupData', editGroupData);
	location.href = location.href.replace('view-group.html', 'create-group.html');
}

const sendMessageToGroup = (e) => {
	localStorage.setItem('sendMessageToGroupId', groupId);
	location.href = location.href.replace('view-group.html', 'create-message.html'); 
}

const addMembersToGroup = async (e) => {
	e.preventDefault();
	let result = {};

	const checked = Array.from(document.querySelectorAll('input[type=checkbox]:checked'));
	const members = checked.map(input => input.value);

	try { 
		const response = await fetch(`${url}groups/${groupId}/users`, {
			method: 'POST',
			body: JSON.stringify({ members }),
			headers: { 
				'Authorization': token,
				'Content-Type': 'application/json',
			}
		});
		result = await response.json();

		if (result.status === 201 && result.data !== undefined) {
			displayFeedback('Group members updated successfully.', 'success', false);
		}
	} catch (e) {
		displayFeedback('There was a problem updating group members, please try again.', 'fail');
	}
}

const deleteMemberFromGroup = async (e) => {
	const member = e.target, memberId = member.id;
	let result = {};
	try { 
		const response = await fetch(`${url}groups/${groupId}/users/${memberId}`, {
			method: 'DELETE',
			headers: { 'Authorization': token }
		});
		result = await response.json();
		
		if (result.status === 200 && result.message !== undefined) {
			const memberPt = member.parentElement;
			memberPt.classList.add('fadeout');
			memberPt.addEventListener('transitionend', (e) => {
				memberPt.parentElement.removeChild(memberPt);
			});		
		}
	} catch (e) {
		displayInfo('There was a problem deleting this group member, please try again.', 'fail')
	}
}

const handleMemberFormClick = (e) => {
	if (showMemberBtn.classList.contains('fa-caret-down')) {
		addMemberForm.style.height = '460px';
		showMemberBtn.className = 'fa fa-caret-up';
	}
	else {
		addMemberForm.style.height = '80px';
		showMemberBtn.className = 'fa fa-caret-down';
	}	
}

const handleGroupContClick = (e) => {
	if (e.target.id === 'edit-group')
		editGroup(e);

	if (e.target.id === 'delete-group')
		deleteGroup(e);

	if (e.target.id === 'add-members-btn')
	  e.preventDefault();

	if (e.target.id === 'send-msg-group-btn')
		sendMessageToGroup(e);
		
	if (e.target.classList.contains('delete-member'))
		deleteMemberFromGroup(e);
}

const init = () => {
	isLoggedIn();
	if (groupId !== undefined || groupId !== "") 
		fetchGroup();
	else 
		location.href = location.href.replace('view-group.html', 'all-groups.html');

	groupCont.addEventListener('click', handleGroupContClick);
	addMemberForm.addEventListener('change', (e) => {
		document.querySelector('#add-members-btn')
			.addEventListener('click', addMembersToGroup);
	});
	showMemberBtn.addEventListener('click', handleMemberFormClick);

}

init();
