const ENABLE_LOGGING = true;
const log = require('../utils/log');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', '..', 'data', 'sorted_recipes.json');
const calculateMealPortions = require('../calculators/calculatePortions');
const calculateUserProfile = require('../calculators/calculateProfile');
const generateRandomUser = require('../generators/generateUser');

function recipeChooserRouter(req, res) {
	const { userProfile } = req.body;
	let userMacros = calculateUserProfile(userProfile);
	findAllValidRecipes(userMacros, (err, validRecipes) => {
		res.status(200).json(validRecipes);
	});
}

async function findAllValidRecipes(userMacros, callback) {
	// Time Debug
	//const time_1 = new Date().getSeconds();
	//log.debug('calculateRecipes.js', 'choose_recipe.html', 'INFO', 'Requesting Recipes', ENABLE_LOGGING);





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
	//const time_2 = new Date().getSeconds();
	//log.debug('calculateRecipes.js', 'choose_recipe.html', 'INFO', `Done [Total time of ${time_2 - time_1} seconds]`, ENABLE_LOGGING);

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



function TestValidRecipeSets() {
	let RunAmount = 100;

	let result = {
		'0': 0,
		'1-250': 0,
		'251-500': 0,
		'501-1000': 0,
		'1001-2000': 0,
		'2001-4000': 0,
		'4001-6000': 0,
		'6000+': 0
	}
	let finished = 0;

	for(let i = 0; i < RunAmount; i++) {
		let randomUser = generateRandomUser();

		let randomUserMacros = calculateUserProfile(randomUser);


		findAllValidRecipes(randomUserMacros, (err, validRecipes) => {

			let totalValidRecipeSets = 0;

			let breakfastKeys = Object.keys(validRecipes).length;
			let lunchKeys = 0;
			let dinnerKeys = 0;

			let breakfastCount = 0;
			let lunchCount = 0;

			
			for(let validBreakfast in validRecipes) {
				
				let validLunchAmount = validRecipes[validBreakfast];

				breakfastCount++;
				
				for(let validLunch in validLunchAmount) {
					
					if(validLunchAmount[validLunch] === "info") {
						continue;
					}

					lunchKeys++;
					lunchCount++;
					
					totalValidRecipeSets += Object.keys(validLunchAmount[validLunch]).length - 1;

					dinnerKeys += Object.keys(validLunchAmount[validLunch]).length - 1;
				}
				
			}
			console.log("Avg. Breakfast keys: " + breakfastKeys)
			console.log("Avg. Lunch keys Per Breakfast: " + lunchKeys / breakfastCount)
			console.log("Avg. Dinner keys Per Lunch: " + dinnerKeys / lunchCount)

			console.log(totalValidRecipeSets);

			if(breakfastKeys == 0) {
				console.table(randomUser);
				console.table(randomUserMacros);
			}
			
			result = CalculateResult(totalValidRecipeSets, result);
			
			finished++;

			if(finished == RunAmount) {
				console.table(result);	
			}
		});
	}
}

function CalculateResult(validSets, result) {
	if(validSets == 0) {
		result['0'] += 1
	}
	if(validSets > 0 && validSets <= 250) {
		result['1-250'] += 1
	}
	if(validSets > 250 && validSets <= 500) {
		result['251-500'] += 1
	}
	if(validSets > 500 && validSets <= 1000) {
		result['501-1000'] += 1
	}
	if(validSets > 1000 && validSets <= 2000) {
		result['1001-2000'] += 1
	}
	if(validSets > 2000 && validSets <= 4000) {
		result['2001-4000'] += 1
	}
	if(validSets > 4000 && validSets <= 6000) {
		result['4001-6000'] += 1
	}
	if(validSets > 6000) {
		result['6000+'] += 1
	}
	return result;
}
