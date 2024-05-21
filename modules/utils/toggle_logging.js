const fs = require('fs');
const path = require('path');
const log = require('./log');

// Function to toggle ENABLE_LOGGING between true and false
function toggleLogging(filePath) {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			console.error(`Error reading file ${filePath}:`, err);
			return;
		}
		let updatedData;
		if (data.includes('// Function to toggle ENABLE_LOGGING between true and false')) {
			return;
		}
		if (data.includes('const ENABLE_LOGGING = true;')) {
			updatedData = data.replace(/const ENABLE_LOGGING = true;/g, 'const ENABLE_LOGGING = false;');
			log.warn('', '', '', `ENABLE_LOGGING to false in ${filePath}`, true, false);
		} else if (data.includes('const ENABLE_LOGGING = false;')) {
			updatedData = data.replace(/const ENABLE_LOGGING = false;/g, 'const ENABLE_LOGGING = true;');
			log.warn('', '', '', `ENABLE_LOGGING to true in ${filePath}`, true, false);
		} else {
			// log.info("", "", "", `No logging flag found in ${filePath}`, true, false);
			return;
		}

		fs.writeFile(filePath, updatedData, 'utf8', (err) => {
			if (err) {
				log.error('', '', '', `Error writing file ${filePath}: ${err}`, true, false);
				return;
			}
			//log.success("", "", "", `Successfully updated ${filePath}`, true, false);
		});
	});
}

// Function to recursively find all .js files in a directory
function findJsFiles(dir) {
	fs.readdir(dir, { withFileTypes: true }, (err, files) => {
		if (err) {
			log.error('', '', '', `Error reading directory ${dir}: ${err}`, true, false);
			return;
		}

		files.forEach((file) => {
			const filePath = path.join(dir, file.name);

			if (file.isDirectory()) {
				findJsFiles(filePath); // Recursively search in the directory
			} else if (file.isFile() && file.name.endsWith('.js')) {
				toggleLogging(filePath);
			}
		});
	});
}

// Start searching for .js files from the project root
const projectRoot = path.resolve(__dirname, '../..');
log.info('', '', '', `Starting search for .js files in ${projectRoot}`, true, false);
findJsFiles(projectRoot);
