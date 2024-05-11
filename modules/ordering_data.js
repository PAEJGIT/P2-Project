const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "data", "accounts.json");

function orderingDataRouter(req, res) {
	const { mealPlan, userDetails, userPreferences } = req.body;
	orderingData(mealPlan, userDetails, userPreferences, (success) => {
		if (success === true) {
			res.status(200);
		} else {
			res.status(400);
		}
	});
}

function orderingData(mealPlan, userDetails, userPreferences, callback) {
    try {
        fs.readFile(filePath, "utf8", (err, data => {
            const fileData = JSON.parse(data);
    
            fileData.users[0].mealPlan = req.body.mealPlan;
            fileData.users[0].userDetails = req.body.userDetails;
            fileData.users[0].userPreferences = req.body.userPreferences;

            fs.writeFile(filePath, JSON.stringify(fileData, undefined, 4), (err) => {
                if(err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        }));
    } catch (error) {
        callback(false);
    }
};

module.exports = orderingDataRouter;