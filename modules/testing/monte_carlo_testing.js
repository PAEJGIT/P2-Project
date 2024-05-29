const calculateUserProfile = require('../calculators/calculateProfile');
const generateRandomUser = require('../generators/generateUser');
const findValidRecipes = require('../calculators/calculateRecipes').findValidRecipes;

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

TestValidRecipeSets(100);
