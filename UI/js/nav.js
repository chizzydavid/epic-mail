//Setup Responsive Navigation
const navIcon = document.querySelector('#nav-icon') ||
	document.querySelector('#nav-icon-home'),
	nav = document.querySelector('.navbar'),
	logoutBtn = document.querySelector('#logout'),
	url = `http://chizzy-epicmail.herokuapp.com/api/v2/`; 
	//`http://localhost:5000/api/v2/`;

function showNavbar() {
	if (navIcon.classList.contains("fa-bars")) {
		nav.className = "navbar responsive open";
		navIcon.className = "fa fa-times";
	}
	else {
		nav.className = "navbar responsive";
		navIcon.className = "fa fa-bars";
	}
}

const displayInfo = (text, wait = 2000) => {
    const modalText = `
		<div class="modal-content">
			<p>${text}</p>
		</div>
    `;
    const newModal = document.createElement('div');
    newModal.setAttribute('class', 'modal');
    document.body.insertAdjacentElement('afterbegin', newModal);

    const modal = document.querySelector('.modal');
    modal.innerHTML = modalText;
    modal.classList.add("show");

    setTimeout(() => {
		modal.classList.remove('show');
		modal.addEventListener('transitionend', () => modal.parentElement.removeChild(modal));
    }, wait);
}

const isLoggedIn = () => {
	if (localStorage.epicMailToken === undefined || localStorage.epicMailToken === '') {
		location.href = location.href.replace(/pages[/a-z-.]{3,}$/, 'pages/sign-in.html');
	}
}

function eventListeners() {
	navIcon.addEventListener('click', showNavbar);
	window.addEventListener('resize', () => {
		if (window.innerWidth <= 760) nav.className = 'navbar';
	});
	if (logoutBtn) {
		logoutBtn.addEventListener('click', () => {
			localStorage.removeItem('epicMailToken');
			localStorage.removeItem('userId');
			location.href = location.href.replace(/pages[/a-z-.]{3,}$/, 'pages/sign-in.html');
		})		
	}
}

eventListeners();

