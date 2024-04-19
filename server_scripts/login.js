const fs = require('fs');

function loginRouter(req, res) {
    const { username, password } = req.body;
    login(username, password, (obj) => {
        if(obj.success === true) {
            res.status(200).json(obj);
        } else {
            res.status(400).json(obj);
        }
    })
}

function login(username, password, callback) {
    let callbackObject = {
        "success": false,
        "data": {},
        "reason": ""
    }

    fs.readFile('./data_storage/accounts.json', (err, data) => {
        if(err) {
            console.error(err);
            callbackObject.reason = "Error reading accounts json file!";
            callback(callbackObject);
            return;
        }
        
        try {
            const users = JSON.parse(data);
            if(users[username] && users[username].password === password) {
                callbackObject.success = true;
                callbackObject.reason = "Found the correct username and password!";
            } else {
                callbackObject.reason = users[username] ? "Password is incorrect!" : "Username is incorrect!";
            }
        } catch (error) {
            callbackObject.reason = "Error parsing accounts json file!";
            console.error(error);
        }

        callback(callbackObject);
    });
}

module.exports = loginRouter