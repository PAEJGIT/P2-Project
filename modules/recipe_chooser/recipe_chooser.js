const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "..", "data", "sorted_recipes.json");

const calculateMealPortions = require('./calc_portions');
const calculateUserProfile = require("./calc_profile");

const generateRandomUser = () => {
    const names = ['Daniel Doe', 'Stefan Doe', 'Johannes Doe', 'Peter Doe'];
    const sexes = ['male', 'female'];
    const goals = ['maintenance', 'musclegain', 'fatloss', 'weightloss', 'weightgain'];
    const preferences = ['omnivore', 'vegetarian', 'vegan', 'balanced'];
    const types = ['keto', 'low-carb', 'high-fiber', 'balanced'];
    const activityFactors = [1, 2, 3, 4, 5];

    const name = names[Math.floor(Math.random() * names.length)];
    const sex = sexes[Math.floor(Math.random() * sexes.length)];
    const weight = sex === 'male' ? Math.round(Math.random() * 50 + 100) : Math.round(Math.random() * 40 + 60);
    const height = sex === 'male' ? Math.round(Math.random() * 70 + 150) : Math.round(Math.random() * 60 + 140);
    const activityFactor = activityFactors[Math.floor(Math.random() * activityFactors.length)];
    const age = activityFactor < 4 ? Math.round(Math.random() * 84 + 16) : Math.round(Math.random() * 40 + 16);
    const pregnant = sex === 'male' ? false : age < 60 ? activityFactor > 3 ? false : Math.random() < 0.5 ? false : true : false;
    const lactating = sex === 'male' ? false : age < 60 ?activityFactor > 3 ? false : Math.random() < 0.5 ? false : true : false;
    const compositionGoal = pregnant ? 'maintenance' : goals[Math.floor(Math.random() * goals.length)];
    const compositionPreference = pregnant ? 'balanced' : preferences[Math.floor(Math.random() * preferences.length)];
    const compositionType = pregnant ? 'balanced' : types[Math.floor(Math.random() * types.length)];

    return {
        name: name,
        sex: sex,
        weightKg: weight,
        heightCm: height,
        age: age,
        activityFactor: activityFactor,
        pregnant: pregnant,
        lactating: lactating,
        compositionGoal: compositionGoal,
        compositionPreference: compositionPreference,
        compositionType: compositionType,
    };
};



function recipeChooserRouter(req, res) {
	//const { userMacro } = req.body;

    let user = generateRandomUser();

    let userMacros = calculateUserProfile(user);

	findAllValidRecipes(userMacros, (err, validRecipes) => {
        res.status(200).json(validRecipes);
    })
}

async function findAllValidRecipes(userMacros, callback) {
    const data = await fs.promises.readFile(filePath, "utf-8");    

    let sortedRecipesJSON = JSON.parse(data);
    
    let validRecipes = {};

    for(let breakfastName in sortedRecipesJSON) {   
        checkValidRecipeSetsOfBreakfast(sortedRecipesJSON[breakfastName].info.name, sortedRecipesJSON, userMacros, validRecipes);
    }

    callback(null, validRecipes);
}

function checkValidRecipeSetsOfBreakfast(recipeName, sortedRecipesJSON, targetMacros, validRecipes) {
    let maxErrorRange = 65;

    validRecipes[recipeName] = {"info": sortedRecipesJSON[recipeName].info};

    let tempRecipeSet = {
        "breakfast": {},
        "lunch": {},
        "dinner": {}
    };

    tempRecipeSet.breakfast = sortedRecipesJSON[recipeName].info;

    let breakfastKey = recipeName;

    let lunchAmount = 0;

    
    for(let lunchKey in sortedRecipesJSON[breakfastKey]) {
        
        if(lunchKey === "info") {
            continue;
        }
        
        validRecipes[recipeName][lunchKey] = {
            "info": sortedRecipesJSON[recipeName][lunchKey].info
        }
        
        let dinnerAmount = 0;
        for(let dinnerKey in sortedRecipesJSON[breakfastKey][lunchKey]) {
            if(dinnerKey === "info") {
                continue;
            }
            
            tempRecipeSet.lunch = sortedRecipesJSON[breakfastKey][lunchKey].info;
            tempRecipeSet.dinner = sortedRecipesJSON[breakfastKey][lunchKey][dinnerKey].info;

            let recipeSetData = calculateMealPortions(targetMacros, tempRecipeSet);

            if(recipeSetData.minError < maxErrorRange) {
                validRecipes[recipeName][lunchKey][dinnerKey] = {
                    "info": sortedRecipesJSON[recipeName][lunchKey][dinnerKey].info,
                }
                dinnerAmount++;
            }
        }

        if(dinnerAmount == 0) {
            delete validRecipes[recipeName][lunchKey];
            continue;
        }
        lunchAmount++;
    }

    if(lunchAmount == 0) {
        delete validRecipes[recipeName];
    }

}

module.exports = recipeChooserRouter;

