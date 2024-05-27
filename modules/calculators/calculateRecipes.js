const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', '..', 'data', 'sorted_recipes.json');
const calculateMealPortions = require('../calculators/calculatePortions');
const calculateUserProfile = require('../calculators/calculateProfile');

const log = require('../utils/log');
const ENABLE_LOGGING = true;

/**
 * Function to route the request to the recipe chooser
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} - The valid recipes
 */
function routerChooseRecipe(req, res) {
	const { userProfile } = req.body;
	let userMacros = calculateUserProfile(userProfile);
	findValidRecipes(userMacros, (err, validRecipes) => {
		res.status(200).json(validRecipes);
	});
}

/**
 * Function to find all valid recipes based on user macros
 * @param {object} userMacros - The user macros
 * @param {function} callback - The callback function
 * @returns {object} - The valid recipes
 */
async function findValidRecipes(userMacros, callback) {
	const data = await fs.promises.readFile(filePath, 'utf-8');
	let sortedRecipesJSON = JSON.parse(data);
	let validRecipes = {};
	for (let breakfastName in sortedRecipesJSON) {
		findRecipeSets(sortedRecipesJSON[breakfastName].info.name, sortedRecipesJSON, userMacros, validRecipes);
	}
	callback(null, validRecipes);
}

/**
 * Function to check the valid recipe sets for a given recipe
 * @param {string} recipe - The name of the recipe
 * @param {object} data - The sorted recipes JSON object
 * @param {object} macroTarget - The macros required to be met
 * @param {object} recipeObject - The valid recipes object
 */
function findRecipeSets(recipe, data, macroTarget, recipeObject) {
	// The maximum error range for the total macros
	let maxErrorRange = 65;
	// Add the recipe info to the object
	recipeObject[recipe] = { info: data[recipe].info };
	// Temporary object to store the recipe sets
	let _recipeSets = {
		breakfast: {},
		lunch: {},
		dinner: {},
	};
	// Set the breakfast info
	_recipeSets.breakfast = data[recipe].info;
	let breakfastKey = recipe;
	let lunchAmount = 0;

	for (let lunchKey in data[breakfastKey]) {
		if (lunchKey === 'info') {
			continue;
		}
		recipeObject[recipe][lunchKey] = {
			info: data[recipe][lunchKey].info,
		};
		let dinnerAmount = 0;
		for (let dinnerKey in data[breakfastKey][lunchKey]) {
			if (dinnerKey === 'info') {
				continue;
			}
			_recipeSets.lunch = data[breakfastKey][lunchKey].info;
			_recipeSets.dinner = data[breakfastKey][lunchKey][dinnerKey].info;
			let recipeSetData = calculateMealPortions(macroTarget, _recipeSets);
			if (recipeSetData.minError < maxErrorRange) {
				recipeObject[recipe][lunchKey][dinnerKey] = {
					info: data[recipe][lunchKey][dinnerKey].info,
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
			delete recipeObject[recipe][lunchKey];
			continue;
		}
		lunchAmount++;
	}
	if (lunchAmount == 0) {
		delete recipeObject[recipe];
	}
}

module.exports = routerChooseRecipe;
