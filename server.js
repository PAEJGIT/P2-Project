// Import necessary modules
const express = require("express"); // Express framework to simplify server creation and routing
const bodyParser = require("body-parser"); // Middleware to parse incoming request bodies into JSON
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing (CORS) for your server
const fs = require("fs"); // Node.js core module to interact with the file system
const path = require("path");
const app = express(); // Create an instance of Express
const port = 3262; // Define the port number the server will listen on

const loginRouter = require("./modules/login");
const registerRouter = require("./modules/register");
const validRecipesRouter = require("./modules/recipe_chooser/recipe_chooser")

/* Middleware used to convert incoming POST requests to JSON */
app.use(express.urlencoded({ extended: true }));

// Use CORS middleware to allow all cross-origin requests
// This is essential for allowing requests from different domains, especially during development.
app.use(cors());

// Use bodyParser middleware to parse JSON bodies into JavaScript objects
// This is crucial for handling JSON data sent from clients.
app.use(bodyParser.json());

// Serve static files from the 'public' directory (e.g., HTML, CSS, JS)
// This line configures Express to serve all static files in the 'public' directory, such as your client-side HTML, CSS, and JavaScript files.
app.use(express.static(__dirname + "/node/static/"));

app.get("/", (req, res) => {
	//res.sendFile(path.join(__dirname, "/node/static/pages/", "front_page.html"));
	res.sendFile(path.join(__dirname, "/node/static/pages/", "recipe_test.html"));
});

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, "/node/static/pages/", "login_page.html"));
});

app.get("/order/choose-mealplan", (req, res) => {
	res.sendFile(path.join(__dirname, "/node/static/pages/", "choose_mealplan.html"));
});

app.get("/order/set-profile", (req, res) => {
	res.sendFile(path.join(__dirname, "/node/static/pages/", "set_profile.html"));
});

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

app.post("/login", loginRouter);

// Route for registration
app.post("/register", registerRouter);

app.post("/validRecipes", validRecipesRouter);

// Start the server on the specified port
// This line makes the server listen on port XXXX and logs a message to the console when it starts successfully.
app.listen(port, "127.0.0.1", () => {
	console.log(`Server listening on http://localhost:${port}`);
});
