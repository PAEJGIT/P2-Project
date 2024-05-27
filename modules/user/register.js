const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../data/accounts.json');
const log = require('../utils/log');

/**
 * Function to route the request to the register function
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
function registerRouter(req, res) {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(400).json({ success: false, reason: 'Missing username or password' });
		return;
	}
	register(username, password, (obj) => {
		if (obj.success === true) {
			res.status(200).json(obj);
		} else {
			res.status(400).json(obj);
		}
	});
}

/**
 * Function to register a new user
 * @param {string} username - The username
 * @param {string} password - The password
 * @param {function} callback - The callback function
 */
function register(username, password, callback) {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			log.error(__filename, null, 'Error reading file', err);
			//console.error("Error reading file:", err);
			callback({ success: false, reason: 'Failed to read file' });
			return;
		}
		const users = JSON.parse(data);

		if (users[username]) {
			callback({ success: false, reason: 'Username already exists' });
			return;
		}

		// Add new user
		users[username] = { password };

		fs.writeFile(filePath, JSON.stringify(users), (err) => {
			if (err) {
				//console.error("Error writing to file:", err);
				log.error(__filename, null, 'Error writing to file', err);
				callback({ success: false, reason: 'Failed to write to file' });
				return;
			}
			//log.success(__filename, null, 'Registration', 'User registered successfully');
			callback({ success: true, reason: 'User registered successfully' });
		});
	});
}

module.exports = {
	registerRouter,
	register
};
