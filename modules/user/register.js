const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../../data/accounts.json");
const log = require("../utils/log");


function registerRouter(req, res) {
  const { username, password } = req.body;
  register(username, password, (obj) => {
    if (obj.success === true) {
      res.status(200).json(obj);
    } else {
      res.status(400).json(obj);
    }
  });
}

function register(username, password, callback) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      log.error(__filename, null, "Error reading file", err);
      //console.error("Error reading file:", err);
      callback({ success: false, reason: "Failed to read file" });
      return;
    }
    const users = JSON.parse(data);

    if (users[username]) {
      callback({ success: false, reason: "Username already exists" });
      return;
    }

    // Add new user
    users[username] = { password };

    fs.writeFile(filePath, JSON.stringify(users), (err) => {
      if (err) {
        //console.error("Error writing to file:", err);
        log.error(__filename, null, "Error writing to file", err);
        callback({ success: false, reason: "Failed to write to file" });
        return;
      }
      log.success(__filename, null, "Registration", "User registered successfully");
      callback({ success: true, reason: "User registered successfully" });
    });
  });
}

module.exports = registerRouter;
