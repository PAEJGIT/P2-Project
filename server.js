// Import the modules object
const modules = require('./modules'); // Import the modules object

const app = modules.express(); // Create an instance of Express
const hostname = '127.0.0.1'; // Define the hostname the server will run on
const port = 3262; // Define the port number the server will listen on

app.use(modules.express.urlencoded({ extended: true })); // Middleware to parse incoming request bodies into JSON
app.use(modules.cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(modules.bodyParser.json()); // Middleware to parse incoming request bodies into JSON
app.use(modules.express.static(__dirname + '/static/')); // Serve static files from the 'public' directory (e.g., HTML, CSS, JS)

/**
 * **GenerateRoutes**
 *
 * *Generate routes for the server based on the routes object*
 * @returns {void}
 */
const GenerateRoutes = () => {
	const routes = {
		stepper: {
			url: '/stepper',
			page: 'stepper.html',
		},
		home: {
			url: '/',
			page: 'home.html',
		},
		login: {
			url: '/login',
			page: 'login_page.html',
		},
		chooseMealPlan: {
			url: '/order/choose-mealplan',
			page: 'choose_mealplan.html',
		},
		setProfile: {
			url: '/pages/set-profile',
			page: 'set_profile.html',
		},
		nutritionalPreference: {
			url: '/pages/nutritional-preference',
			page: 'nutritional_preference.html',
		},
		orderSummary: {
			url: '/order/summary',
			page: 'summary.html',
		},
		chooseRecipe: {
			url: '/order/choose-recipe',
			page: 'choose_recipe.html',
		},
		dashboard: {
			url: '/dashboard',
			page: 'dashboard.html',
		},
		orderProcess: {
			url: '/order',
			page: 'ordering_process.html',
		},
		recipesDB: {
			url: '/recipes',
			page: 'recipesDB.html',
		},
		ingredientsDB: {
			url: '/ingredients',
			page: 'ingredientsDB.html',
		},
	};
	Object.keys(routes).forEach((route) => {
		app.get(routes[route].url, (req, res) => {
			res.sendFile(modules.path.join(__dirname, '/static/pages/', routes[route].page), (err) => {
				if (err) {
					modules.log.error(__filename, null, 'Error sending file', err);
					res.status(500).send('Internal Server Error');
				}
			});
		});
	});
};
GenerateRoutes(); // Generate routes for the server

app.post('/login', modules.loginRouter); // Define the login route
app.post('/register', modules.registerRouter); // Define the register route
app.post('/ordering-data', modules.orderingDataRouter); // Define the ordering data route
app.post('/validRecipes', modules.validRecipesRouter); // Define the recipe chooser route

// Define the route to update the user profile
app.post('/updateProfile', (req, res) => {
	const { username, userProfile } = req.body;
	modules.fs.readFile(modules.path.join(__dirname, 'data', 'accounts.json'), 'utf8', (err, data) => {
		if (err) {
			console.error('Error reading accounts file:', err);
			return res.status(500).send('Server error');
		}
		const accounts = JSON.parse(data);
		if (!accounts[username]) {
			return res.status(404).send('User not found');
		}
		accounts[username].userProfile = userProfile;
		modules.fs.writeFile(
			modules.path.join(__dirname, 'data', 'accounts.json'),
			JSON.stringify(accounts, null, 2),
			'utf8',
			(err) => {
				if (err) {
					console.error('Error writing accounts file:', err);
					return res.status(500).send('Server error');
				}
				res.send('Profile updated successfully');
			}
		);
	});
});

// Start the server on the specified port
app.listen(port, '127.0.0.1', () => {
	modules.log.success(__filename, null, 'Server listening on', `http://${hostname}:${port}/`);
});
