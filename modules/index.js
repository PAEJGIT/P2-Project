// Object containing all the modules required for the server
const modules = {
	express: require('express'),                                    	// Express framework to simplify server creation and routing
	bodyParser: require('body-parser'),                             	// Middleware to parse incoming request bodies into JSON
	cors: require('cors'),                                          	// Middleware to enable Cross-Origin Resource Sharing (CORS) for your server
	fs: require('fs'),                                              	// Node.js core module to interact with the file system
	path: require('path'),                                          	// Node.js core module to work with file paths
	loginRouter: require('./user/login').loginRouter,                   // Import the login router
	registerRouter: require('./user/register').registerRouter,          // Import the register router
	validRecipesRouter: require('./calculators/calculateRecipes'), 		// Import the recipe chooser router
    log: require('./utils/log'),                                    	// Import the log module
	calculateMealPortions: require('./calculators/calculatePortions'),  // Import the calculate portions module
	calculateUserProfile: require('./calculators/calculateProfile'),    // Import the calculate profile module
	calculateRecipes: require('./calculators/calculateRecipes'),        // Import the calculate recipes module
	updateProfile: require('./user/updateProfile'),                     // Import the update profile module
	getProfile: require('./user/getProfile'),                           // Import the get profile module
};
module.exports = modules;                                           	// Export the modules object