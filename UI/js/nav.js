//Setup Responsive Navigation
const navIcon = document.querySelector('#nav-icon'),
		  nav = document.querySelector("#navigation");

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

function eventListeners() {
	navIcon.addEventListener('click', showNavbar);
	window.addEventListener('resize', () => {
		if (window.innerWidth <= 760) nav.className = 'navbar';
	});

}

eventListeners();

