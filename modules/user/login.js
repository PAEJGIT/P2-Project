const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../data/accounts.json');

function loginRouter(req, res) {
	const { username, password } = req.body;
	login(username, password, (obj) => {
		if (obj.success === true) {
			res.status(200).json(obj);
		} else {
			res.status(400).json(obj);
		}
	});
}

function login(username, password, callback) {
	let callbackObject = {
		success: false,
		data: {},
		reason: '',
	};

	console.log('Attempting to read from:', filePath);
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			console.error('File read error:', err);
			callbackObject.reason = 'Error reading accounts json file!';
			callback(callbackObject);
			return;
		}

		try {
			const users = JSON.parse(data);
			if (users[username] && users[username].password === password) {
				callbackObject.success = true;
				callbackObject.data.username = username;
				callbackObject.reason = 'Found the correct username and password!';
				// Write the username to use in the session
			} else {
				callbackObject.reason = users[username] ? 'Password is incorrect!' : 'Username is incorrect!';
			}
		} catch (error) {
			callbackObject.reason = 'Error parsing accounts json file!';
			console.error(error);
		}
		callback(callbackObject);
	});
}

module.exports = {
	loginRouter,
	login
};
