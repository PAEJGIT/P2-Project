const fs = require('fs');
const path = require('path');
const log = require('../utils/log');

const ENABLE_LOGGING = false;

/**
 * Updates the user profile in the accounts.json file.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
module.exports = function updateProfile(req, res) {
	const { username, userProfile } = req.body;
	fs.readFile(path.join(__dirname, '../../data/accounts.json'), 'utf8', (err, data) => {
		log.info(__filename, 'updateProfile', 'Reading and updating accounts file to user', username, ENABLE_LOGGING);
		if (err) {
			log.warn(__filename, 'updateProfile', 'Error reading accounts file. Check path', err, ENABLE_LOGGING);
			return res.status(500).send('Server error');
		}
		const accounts = JSON.parse(data);
		if (!accounts[username]) {
			log.warn(__filename, 'updateProfile', `User with input of ${username} not found`, err, ENABLE_LOGGING);
			return res.status(404).send('User not found');
		}
		accounts[username].userProfile = userProfile;
		fs.writeFile(
			path.join(__dirname, '../../data/accounts.json'),
			JSON.stringify(accounts, null, 2),
			'utf8',
			(err) => {
				if (err) {
					log.error(
						__filename,
						'updateProfile',
						'Error reading accounts file. Check path',
						err,
						ENABLE_LOGGING
					);
					return res.status(500).send('Server error');
				}
				ENABLE_LOGGING ? res.send('Successfully updated profile') : null;
			}
		);
	});
};
