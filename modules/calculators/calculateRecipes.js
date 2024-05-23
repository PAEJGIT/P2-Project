const ENABLE_LOGGING = true;
const log = require('../utils/log');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', '..', 'data', 'sorted_recipes.json');
const calculateMealPortions = require('../calculators/calculatePortions');
const calculateUserProfile = require('../calculators/calculateProfile');

function recipeChooserRouter(req, res) {
	const { userProfile } = req.body;
	let userMacros = calculateUserProfile(userProfile);
<<<<<<< Updated upstream
	console.table(userMacros);
=======
>>>>>>> Stashed changes
	findAllValidRecipes(userMacros, (err, validRecipes) => {
		res.status(200).json(validRecipes);
	});
}

async function findAllValidRecipes(userMacros, callback) {
	// Time Debug
	const time_1 = new Date().getSeconds();
	log.debug('calculateRecipes.js', 'choose_recipe.html', 'INFO', 'Requesting Recipes', ENABLE_LOGGING);





	const data = await fs.promises.readFile(filePath, 'utf-8');
	let sortedRecipesJSON = JSON.parse(data);
	let validRecipes = {};
	for (let breakfastName in sortedRecipesJSON) {
		checkValidRecipeSetsOfBreakfast(
			sortedRecipesJSON[breakfastName].info.name,
			sortedRecipesJSON,
			userMacros,
			validRecipes
		);
	}

	// Time Debug
	const time_2 = new Date().getSeconds();
	log.debug('calculateRecipes.js', 'choose_recipe.html', 'INFO', `Done [Total time of ${time_2 - time_1} seconds]`, ENABLE_LOGGING);

	callback(null, validRecipes);
}

function checkValidRecipeSetsOfBreakfast(recipeName, sortedRecipesJSON, targetMacros, validRecipes) {
	let maxErrorRange = 65;
	validRecipes[recipeName] = { info: sortedRecipesJSON[recipeName].info };
	let tempRecipeSet = {
		breakfast: {},
		lunch: {},
		dinner: {},
	};

	tempRecipeSet.breakfast = sortedRecipesJSON[recipeName].info;
	let breakfastKey = recipeName;
	let lunchAmount = 0;

	for (let lunchKey in sortedRecipesJSON[breakfastKey]) {
		if (lunchKey === 'info') {
			continue;
		}
		validRecipes[recipeName][lunchKey] = {
			info: sortedRecipesJSON[recipeName][lunchKey].info,
		};
		let dinnerAmount = 0;
		for (let dinnerKey in sortedRecipesJSON[breakfastKey][lunchKey]) {
			if (dinnerKey === 'info') {
				continue;
			}
			tempRecipeSet.lunch = sortedRecipesJSON[breakfastKey][lunchKey].info;
			tempRecipeSet.dinner = sortedRecipesJSON[breakfastKey][lunchKey][dinnerKey].info;
			let recipeSetData = calculateMealPortions(targetMacros, tempRecipeSet);
			if (recipeSetData.minError < maxErrorRange) {
				validRecipes[recipeName][lunchKey][dinnerKey] = {
					info: sortedRecipesJSON[recipeName][lunchKey][dinnerKey].info,
					portions: [
						recipeSetData.bestPortions.breakfast,
						recipeSetData.bestPortions.lunch,
						recipeSetData.bestPortions.dinner,
					],
					macros: recipeSetData.bestTotals,
				};
				dinnerAmount++;
			}
		}

		if (dinnerAmount == 0) {
			delete validRecipes[recipeName][lunchKey];
			continue;
		}
		lunchAmount++;
	}
	if (lunchAmount == 0) {
		delete validRecipes[recipeName];
	}
}

module.exports = recipeChooserRouter;
