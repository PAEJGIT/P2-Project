document.addEventListener("DOMContentLoaded", function () {
    
    let loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const inputData = {
            username: loginForm.querySelector('input[name="username"]').value,
            password: loginForm.querySelector('input[name="password"]').value,
        };

        reqLogin(inputData.username, inputData.password);
    });

});

function reqLogin(username, password) {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the response from the server
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}