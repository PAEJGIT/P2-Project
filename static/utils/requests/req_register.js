document.getElementById('registerForm').addEventListener('submit', function (event) {
	event.preventDefault();
	const username = this.querySelector('input[name="usernameRegister"]').value;
	const password = this.querySelector('input[name="passwordRegister"]').value;
	const wrapper = document.getElementsByClassName('wrapper');

	fetch('/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ username, password }),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			if (data.success) {
				// Set wrapper to class: wrapper active-popup
				wrapper[0].classList.remove('active');
				//alert('Registration Successful');
			} else {
				alert('Registration Failed: ' + data.reason);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
});
