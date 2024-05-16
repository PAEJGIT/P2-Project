
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', '..', 'data', 'sorted_recipes.json');
const calculateMealPortions = require('../calculators/calculatePortions');
const calculateUserProfile = require('../calculators/calculateProfile');
const generateRandomUser = require('../generators/generateUser');

function recipeChooserRouter(req, res) {
	const { userProfile } = req.body;
	let user = generateRandomUser();
	let userMacros = calculateUserProfile(userProfile);
	console.table(userMacros)
	findAllValidRecipes(userMacros, (err, validRecipes) => {
		res.status(200).json(validRecipes);
	});
}

async function findAllValidRecipes(userMacros, callback) {
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
