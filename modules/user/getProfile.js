// Fetch user profile from data/accounts.json
const ENABLE_LOGGING = true;
const fs = require('fs');
const path = require('path');
const log = require('../utils/log');

const getProfile = (req, res) => {
	const { username } = req.body;
    let userProfile = null;
	fs.readFile(path.join(__dirname, '../../data/accounts.json'), 'utf8', (err, data) => {
		log.info(__filename, 'getProfile', 'Searching for account...', username, ENABLE_LOGGING);
		if (err) {
			log.warn(__filename, 'getProfile', 'Error finding accounts file. Check path', err, ENABLE_LOGGING);
			return res.status(500).send('Server error');
		}
		const accounts = JSON.parse(data);
		if (!accounts[username]) {
			log.warn(__filename, 'getProfile', `User with input of ${username} not found`, err, ENABLE_LOGGING);
			return res.status(404).send('User not found');
		}
		log.info(__filename, 'getProfile', `User with input of ${username} found`, ENABLE_LOGGING);
		userProfile = accounts[username];
        return res.status(200).send(userProfile);
	});
};

module.exports = getProfile;
