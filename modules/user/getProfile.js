// Fetch user profile from data/accounts.json

const fs = require('fs');
const path = require('path');

const getProfile = (username) => {
	const accounts = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/accounts.json'), 'utf8'));
    return Object.keys(accounts).find((account) => account.username === username);
};

module.exports = getProfile;