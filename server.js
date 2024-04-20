// Import necessary modules
const express = require("express"); // Express framework to simplify server creation and routing
const bodyParser = require("body-parser"); // Middleware to parse incoming request bodies into JSON
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing (CORS) for your server
const fs = require("fs"); // Node.js core module to interact with the file system
const path = require('path');
const app = express(); // Create an instance of Express
const port = 3262; // Define the port number the server will listen on

const loginRouter = require("./modules/login");

// Use CORS middleware to allow all cross-origin requests
// This is essential for allowing requests from different domains, especially during development.
app.use(cors());

// Use bodyParser middleware to parse JSON bodies into JavaScript objects
// This is crucial for handling JSON data sent from clients.
app.use(bodyParser.json());

// Serve static files from the 'public' directory (e.g., HTML, CSS, JS)
// This line configures Express to serve all static files in the 'public' directory, such as your client-side HTML, CSS, and JavaScript files.
app.use(express.static("node/static/"));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/node/static/pages/", "login_page.html"));
});

app.post("/login", loginRouter);

// Start the server on the specified port
// This line makes the server listen on port 3000 and logs a message to the console when it starts successfully.
app.listen(port, "127.0.0.1", () => {
  console.log(`Server listening on http://localhost:${port}`);
});
