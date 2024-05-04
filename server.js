// Import Modules
const express = require("express"); // Express framework to simplify server creation and routing
const bodyParser = require("body-parser"); // Middleware to parse incoming request bodies into JSON
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing (CORS) for your server
const fs = require("fs"); // Node.js core module to interact with the file system
const path = require("path"); // Node.js core module to work with file paths
// Import custom modules
const loginRouter = require("./modules/login"); // Import the login module
const registerRouter = require("./modules/register"); // Import the register module
const log = require("./modules/logger"); // Import the register module

// Create an instance of Express
const app = express();
const hostname = "127.0.0.1";
const port = 3262; //

/* Middleware used to convert incoming POST requests to JSON */
app.use(express.urlencoded({ extended: true }));
// Use CORS middleware to allow all cross-origin requests. This is essential for allowing requests from different domains, especially during development.
app.use(cors());
// Use bodyParser middleware to parse JSON bodies into JavaScript objects. This is crucial for handling JSON data sent from clients.
app.use(bodyParser.json());
// Serve static files from the 'public' directory (e.g., HTML, CSS, JS). This line configures Express to serve all static files in the 'public' directory, such as your client-side HTML, CSS, and JavaScript files.
app.use(express.static(__dirname + "/node/static/"));

// ROUTING
const path_to_pages = (page) => path.join(__dirname, "/node/static/pages/", page);
const routes = {
	Home: {
		url: "/",
		page: "front_page.html",
	},
	Login: {
		url: "/login",
		page: "login_page.html",
	},
	"Choose Meal Plan": {
		url: "/order/choose-mealplan",
		page: "choose_mealplan.html",
	},
	"Set Profile": {
		url: "/order/set-profile",
		page: "set_profile.html",
	},
	"Recipes Database": {
		url: "/recipes",
		page: "recipesDB.html",
	},
	"Ingredients Database": {
		url: "/ingredients",
		page: "ingredientsDB.html",
	},
};
Object.keys(routes).forEach((route) => {
	app.get(routes[route].url, (req, res) => {
		res.sendFile(path_to_pages(routes[route].page));
	});
});

app.post("/login", loginRouter);
app.post("/register", registerRouter);
app.get("/order/test", (req, res) => {
	res.sendFile(path.join(__dirname, "/node/static/pages/", "test.html"));
});


app.post("/mealplandata", (req, res) => {
	/* retrieves data from user when they choose family/meal count and saves it in the accounts.json file */
	try {
		const data = fs.readFileSync(__dirname + "/data/temp.json");

		const jsonData = JSON.parse(data);

		/*
    const index = jsonData.findIndex(x => x.email === "peter@gmail.com");
    */

		jsonData.users[0].familySize = req.body.number_of_people;
		jsonData.users[0].meals = req.body.number_of_meals;


		fs.writeFileSync(__dirname + "/data/accounts.json", JSON.stringify(jsonData, undefined, 4));

		res.redirect("/order/set-profile");
	} catch (error) {
		console.error("Error:", error);
		res.status(500).send("Internal server error");
	}
});

// API
app.get("/api/recipes", (req, res) => {
	// Specify the path to your JSON file
	const filePath = "data/recipes.json";
	// Read the JSON file
	fs.readFile(filePath, (err, data) => {
		if (err) {
			// Send an error message if the file cannot be read
			res.status(500).send("An error occurred while reading recipes.json");
			return;
		}
		try {
			// Parse the JSON data
			const jsonData = JSON.parse(data);
			// Send the parsed data
			res.json(jsonData);
		} catch (e) {
			// Handle parsing errors
			res.status(500).send("Error parsing JSON data.");
		}
	});
});
app.get("/api/ingredients", (req, res) => {
	// Specify the path to your JSON file
	const filePath = "data/ingredients.json";
	// Read the JSON file
	fs.readFile(filePath, (err, data) => {
		if (err) {
			// Send an error message if the file cannot be read
			log.error(__filename, null, "Error reading ingredients.json", err);
			res.status(500).send("An error occurred while reading ingredients.json");
			return;
		}
		try {
			// Parse the JSON data
			const jsonData = JSON.parse(data);
			// Send the parsed data
			res.json(jsonData);
		} catch (e) {
			// Handle parsing errors
			log.error(__filename, null, "Error parsing ingredients.json", e);
			res.status(500).send("Error parsing JSON data.");
		}
	});
});

// Start the server on the specified port and hostname
app.listen(port, hostname, () => {
	log.success(__filename, null, "Server listening on", `http://${hostname}:${port}`);
});

// Define a route for the home page
//app.get(routes["Home"].url, (req, res) => {
//	res.sendFile(path_to_pages(routes["Home"].page));
//});
//
//app.get("/login", (req, res) => {
//	res.sendFile(path.join(__dirname, "/node/static/pages/", "login_page.html"));
//});
//
//app.get("/order/choose-mealplan", (req, res) => {
//	res.sendFile(path.join(__dirname, "/node/static/pages/", "choose_mealplan.html"));
//});
//
//app.get("/order/set-profile", (req, res) => {
//	res.sendFile(path.join(__dirname, "/node/static/pages/", "set_profile.html"));
//});
