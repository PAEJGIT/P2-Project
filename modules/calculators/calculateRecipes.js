const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', '..', 'data', 'sorted_recipes.json');
const calculateMealPortions = require('../calculators/calculatePortions');
const calculateUserProfile = require('../calculators/calculateProfile');
const generateRandomUser = require('../generators/generateUser');

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

// TODO: Remove the test function before release
/**
 * Function to test the valid recipe sets
 * @returns {object} - The result of the test
 * @param {number} RunAmount - The number of times to run the test
 */
function TestValidRecipeSets(RunAmount = 100) {
	let runCount = RunAmount;

	let result = {
		'0': 0,
		'1-250': 0,
		'251-500': 0,
		'501-1000': 0,
		'1001-2000': 0,
		'2001-4000': 0,
		'4001-6000': 0,
		'6000+': 0,
	};
	let finished = 0;

	for (let i = 0; i < runCount; i++) {
		let randomUser = generateRandomUser();

		let randomUserMacros = calculateUserProfile(randomUser);

		findValidRecipes(randomUserMacros, (err, validRecipes) => {
			let totalValidRecipeSets = 0;

			let breakfastKeys = Object.keys(validRecipes).length;
			let lunchKeys = 0;
			let dinnerKeys = 0;

			let breakfastCount = 0;
			let lunchCount = 0;

			for (let validBreakfast in validRecipes) {
				let validLunchAmount = validRecipes[validBreakfast];

				breakfastCount++;

				for (let validLunch in validLunchAmount) {
					if (validLunchAmount[validLunch] === 'info') {
						continue;
					}

					lunchKeys++;
					lunchCount++;

					totalValidRecipeSets += Object.keys(validLunchAmount[validLunch]).length - 1;

					dinnerKeys += Object.keys(validLunchAmount[validLunch]).length - 1;
				}
			}
			console.log('Avg. Breakfast keys: ' + breakfastKeys);
			console.log('Avg. Lunch keys Per Breakfast: ' + lunchKeys / breakfastCount);
			console.log('Avg. Dinner keys Per Lunch: ' + dinnerKeys / lunchCount);

			console.log(totalValidRecipeSets);

			if (breakfastKeys == 0) {
				console.table(randomUser);
				console.table(randomUserMacros);
			}

			result = CalculateResult(totalValidRecipeSets, result);

			finished++;

			if (finished == runCount) {
				console.table(result);
			}
		});
	}
}

/**
 * Function to calculate the result of the test
 * @param {number} validSets - The number of valid sets
 * @param {object} result - The result object
 */
function CalculateResult(validSets, result) {
	if (validSets == 0) {
		result['0'] += 1;
	}
	if (validSets > 0 && validSets <= 250) {
		result['1-250'] += 1;
	}
	if (validSets > 250 && validSets <= 500) {
		result['251-500'] += 1;
	}
	if (validSets > 500 && validSets <= 1000) {
		result['501-1000'] += 1;
	}
	if (validSets > 1000 && validSets <= 2000) {
		result['1001-2000'] += 1;
	}
	if (validSets > 2000 && validSets <= 4000) {
		result['2001-4000'] += 1;
	}
	if (validSets > 4000 && validSets <= 6000) {
		result['4001-6000'] += 1;
	}
	if (validSets > 6000) {
		result['6000+'] += 1;
	}
	return result;
}
