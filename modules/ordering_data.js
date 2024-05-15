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
        fs.readFile(filePath, "utf8", (err, data) => { 
            if (err) {
                callback(false);
                return;
            }

            const fileData = JSON.parse(data);

            fileData["peter"].mealPlan = mealPlan;
            fileData["peter"].userDetails = userDetails;
            fileData["peter"].userPreferences = userPreferences;

            fs.writeFile(filePath, JSON.stringify(fileData, null, 4), (err) => {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        });
    } catch (error) {
        callback(false);
    }
};

module.exports = orderingDataRouter;