function eventListeners() {
	const imgPreview = document.querySelector('#image-preview');

	//set up image preview for when a user uploads his picture
	document.querySelector('#image-upload').addEventListener('change', (e) => {
		imgPreview.src = URL.createObjectURL(e.target.files[0]);
		imgPreview.setAttribute('height', '150px');
		imgPreview.addEventListener('load', (e) => URL.revokeObjectURL(e.target.src));
	});

	document.querySelector('#submit-login').addEventListener('click', () => {
		console.log('submit clicked');
	}
}

eventListeners();


