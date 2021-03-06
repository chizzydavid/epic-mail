const form = document.querySelector('#create-group-form'),
feedback = document.querySelector('#form-feedback'),
email = document.querySelector('#msg-recipient'),
token = localStorage.epicMailToken,
editGroup = localStorage.editGroupData;
groupName = document.querySelector('#group-name'),
groupDesc = document.querySelector('#group-description'),
membersCont = document.querySelector('#members-container'),
createGroupBtn = document.querySelector('#create-group');

let editGroupId;

const displayFeedback = (message, status, err = true) => {
	feedback.className = status;
	feedback.innerHTML = message;
	feedback.scrollIntoView({behavior: "smooth", block: "end"});
	if (err) throw Error('');
}

const displayUsers = (users) => {
	membersCont.innerHTML = '';
	users.forEach(user => {
		const newUser = 
		  `<p><input type="checkbox" value="${user.user_id}" > ${user.first_name} ${user.last_name}</p>`;
		membersCont.insertAdjacentHTML('beforeend', newUser);		
	});
}

const populateForm = async () => {
	if (!editGroup) {
		let result = {};
		try {
			const response = await fetch(`${url}users`, {
				method: 'GET',
				headers: { 'Authorization': token }
			});
			result = await response.json();

			if (result.status === 200 && result.data !== undefined) {
				displayUsers(result.data);
			}
			else if (result.status === 401) {
				displayFeedback('There was a problem getting all users, please refresh the page.', 'fail', false);
			}

		} catch (e) {
			displayFeedback('There was a problem getting all users, please refresh the page.', 'fail', false)
		}
	}
	else {
		document.querySelector('#members-wrapper').classList.add('hide');
		const { groupId, name, description } = JSON.parse(editGroup);
		[groupName.value, groupDesc.value, editGroupId] = [name, description, groupId];
		form.querySelector('h3').innerText = 'Edit Group';
		createGroupBtn.innerText = 'Save';
		localStorage.removeItem('editGroupData');
	}
}

const validateGroup = () => {	
	let gName = groupName.value.trim(), gDesc = groupDesc.value.trim();

	if (!gName || !gDesc) {
		displayFeedback('Enter a group name and description.', 'fail');
	}

	if (!/[\S]{3,}/.test(gName) || !/[\S]{3,}/.test(gDesc)) {
		displayFeedback('Invalid input', 'fail');
	}
}

const createGroup = async (e) => {
	e.preventDefault();
	validateGroup();
	let data = {}, result = {};
	const formData = new FormData(form);

	//transform formdata to native JS Object
	Array.from(formData.entries()).forEach(entry => data[entry[0]] = entry[1].trim());

	//if a new group is being created(not an edited group) get newly added members of the group
	if (!editGroup) {
		const checked = Array.from(document.querySelectorAll('input[type=checkbox]:checked'));
		const members = checked.map(input => input.value);	
		data['members'] = members;
	}

	//change url and http method depending on if the group is a newly created one or an edited group.
	let [query, method] = editGroup ? [`groups/${editGroupId}`, 'PUT'] : [`groups`, 'POST'];

	try {
		const response = await fetch(`${url}${query}`, {
			method: method,
			body: JSON.stringify(data),
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': token,
			}
		});
		result = await response.json();
		
		if (result.status === 201) {
			displayFeedback('Group created successfully.', 'success', false);
		}
		
		if (result.status === 200) {
			displayFeedback('Group successfully edited.', 'success', false);
		}

		else if (result.status === 400 && Array.isArray(result.error)) {
			const errors = result.error.join('</br>');
			displayFeedback(errors, 'fail', false);
		}

	} catch (e) {
		displayFeedback(`There was a problem ${editGroup ? 'editing' : 'creating'} your group, please try again. ${e}`, 'fail');
	}  
}

const init = () => {
	isLoggedIn();
	populateForm();
	Array.from(document.querySelectorAll('.group-input')).forEach(input => {
		input.addEventListener('focus', () => feedback.className = '');
	});

	if (editGroup) {
		createGroupBtn.disabled = true;
		form.addEventListener('change', () => createGroupBtn.disabled = false);
	}
	createGroupBtn.addEventListener('click', createGroup);
		
}

init();
