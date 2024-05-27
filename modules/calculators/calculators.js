/**
 * **calculateBMI**
 * Calculates the Body Mass Index (BMI) based on the user's weight and height.
 * @param {number} weight - The weight of the user in kilograms. Must be positive.
 * @param {number} height - The height of the user in centimeters. Must be positive.
 * @returns {number} The calculated BMI value.
 */
const calculateBMI = (weight, height) => {
	if (weight <= 0 || height <= 0) {
		throw new Error('Invalid input values for calculating BMI.');
	} else {
		const BMI = weight / Math.pow(height / 100, 2);
		return BMI;
	}
};

/**
 * **calculateBMR**
 *
 * Calculates the Basal Metabolic Rate (BMR) using the Harris-Benedict Equation.
 * @param {string} sex - The sex of the user ('male' or 'female'). Must be 'male' or 'female'.
 * @param {number} age - The age of the user in years. Must be a positive integer.
 * @param {number} weight - The weight of the user in kilograms. Must be positive.
 * @param {number} height - The height of the user in centimeters. Must be positive.
 * @returns {number} The calculated BMR value.
 * @throws {Error} If any input is not valid.
 */
const calculateBMR = (sex, age, weight, height) => {
	// Convert sex input to lower case to ensure case-insensitivity
	sex = sex.toLowerCase();
	if (!['male', 'female'].includes(sex) || age <= 0 || weight <= 0 || height <= 0) {
		throw new Error('Invalid input values for calculating BMR.');
	} else {
		const BMR =
			sex === 'male'
				? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
				: 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
		return BMR;
	}
};

/**
 * Calculate the Total Daily Energy Expenditure (TDEE) based on the user's BMR and activity factor.
 * @param {number} BMR - The Basal Metabolic Rate of the user.
 * @param {number} activityFactor - The activity factor of the user.
 * @returns {number} The calculated TDEE value.
 */
const calculateTDEE = (BMR, activityFactor) => {
	let TDEE = 0;
	activityFactor = activityFactor.toString();
	if (activityFactor < 1 || activityFactor > 5) {
		throw new Error('Invalid input values for calculating TDEE.', {
			cause: "Invalid input for 'activityFactor'",
		});
	} else {
		switch (activityFactor) {
			case '1':
				TDEE += BMR * 1.2;
				break;
			case '2':
				TDEE += BMR * 1.375;
				break;
			case '3':
				TDEE += BMR * 1.55;
				break;
			case '4':
				TDEE += BMR * 1.725;
				break;
			case '5':
				TDEE += BMR * 1.9;
				break;
			default:
				throw new Error('Unexpected activityFactor value.', {
					cause: `Unexpected value: ${activityFactor}`,
				});
		}

		return TDEE;
	}
};

/**
 * Calculate the adjusted Total Daily Energy Expenditure (TDEE) based on the user's health goal.
 * @param {number} TDEE - The Total Daily Energy Expenditure of the user.
 * @param {string} compositionGoal - The health goal of the user ('maintenance', 'musclegain', 'fatloss', 'weightloss', 'weightgain').
 * @returns {number} The adjusted TDEE value.
 * @throws {Error} If the TDEE or health goal is invalid.
 */
const calculateAdjustedTDEE = (TDEE, compositionGoal) => {
	const modifiers = {
		maintenance: 0,
		musclegain: 300,
		fatloss: -300,
		weightloss: -500,
		weightgain: 500,
	};
	const roundToNearest = (numberToRound, toNearestNumber) =>
		Math.round(numberToRound / toNearestNumber) * toNearestNumber;
	if (TDEE <= 0) {
		throw new Error('Invalid TDEE value');
	} else if (!['maintenance', 'musclegain', 'fatloss', 'weightloss', 'weightgain'].includes(compositionGoal)) {
		throw new Error('Invalid health goal');
	} else {
		return roundToNearest(TDEE + modifiers[compositionGoal], 50);
	}
};

/**
 * Calculates the protein requirements for a user based on their demographic and dietary details.
 *
 * @param {string} sex - The sex of the user, either 'male' or 'female'.
 * @param {number} age - The age of the user in years.
 * @param {number} weight - The weight of the user in kilograms.
 * @param {number} activityFactor - A numeric scale indicating activity level, where 4 or greater represents high activity.
 * @param {boolean} pregnant - Indicates if the user is pregnant.
 * @param {boolean} lactating - Indicates if the user is lactating.
 * @param {string} compositionGoal - The user's fitness goal, such as 'maintenance', 'musclegain', 'fatloss', 'weightloss', or 'weightgain'.
 * @param {string} compositionPreference - Dietary preference of the user, such as 'vegan', 'vegetarian', etc.
 * @returns {number} The calculated protein requirement in grams.
 */
const calculateProteins = (
	sex,
	age,
	weight,
	activityFactor,
	pregnant,
	lactating,
	compositionGoal,
	compositionPreference
) => {
	const ageGroup = age > 60 ? 'over60' : 'under60';
	const activityLevel = activityFactor >= 4 ? 'high' : 'low';

	const multipliers = {
		maintenance: {
			over60: {
				male: { high: 1.3, low: 1.2 },
				female: { high: 1.2, low: 1.1 },
			},
			under60: {
				male: { high: 1.2, low: 1.1 },
				female: { high: 1.1, low: 1.0 },
			},
		},
		musclegain: {
			over60: {
				male: { high: 2.0, low: 1.9 },
				female: { high: 1.9, low: 1.8 },
			},
			under60: {
				male: { high: 1.9, low: 1.8 },
				female: { high: 1.8, low: 1.7 },
			},
		},
		fatloss: {
			over60: {
				male: { high: 1.7, low: 1.6 },
				female: { high: 1.6, low: 1.5 },
			},
			under60: {
				male: { high: 1.6, low: 1.5 },
				female: { high: 1.5, low: 1.4 },
			},
		},
		weightloss: {
			over60: {
				male: { high: 1.5, low: 1.4 },
				female: { high: 1.4, low: 1.3 },
			},
			under60: {
				male: { high: 1.4, low: 1.3 },
				female: { high: 1.3, low: 1.2 },
			},
		},
		weightgain: {
			over60: {
				male: { high: 1.4, low: 1.3 },
				female: { high: 1.3, low: 1.2 },
			},
			under60: {
				male: { high: 1.4, low: 1.2 },
				female: { high: 1.3, low: 1.1 },
			},
		},
	};
	const multiplier =
		multipliers[compositionGoal][ageGroup][sex][activityLevel] +
			(pregnant ? 0.8 : lactating ? 0.4 : 0) +
			(compositionPreference === 'vegan' ? 0.2 : 0) +
			(compositionPreference == 'vegetarian' ? 0.1 : 0) || 1;
	return Math.round(weight * multiplier);
};

/**
 * Calculates the estimated carbohydrate needs based on the remaining calories and health goal.
 * @param {object} data - The data object containing the user's data.
 * @param {number} options.remainingCalories - The remaining calories after accounting for proteins and carbohydrates.
 * @param {number} options.age - The age of the user in years.
 * @param {number} options.activityFactor - The activity factor of the user.
 * @param {boolean} options.pregnant - Whether the user is pregnant.
 * @param {string} options.compositionGoal - The health goal of the user ('maintenance', 'musclegain', 'fatloss', 'weightloss', 'weightgain').
 * @param {string} options.compositionPreference - The dietary preference of the user ('omnivore', 'vegetarian', 'vegan', 'balanced').
 * @param {string} options.compositionType - The dietary type of the user ('keto', 'low-carb', 'high-fiber', 'balanced').
 * @returns {number} The estimated carbohydrate intake in grams.
 */
const calculateCarbs = (
	remainingCalories,
	age,
	activityFactor,
	pregnant,
	compositionGoal,
	compositionPreference,
	compositionType
) => {
	const ageGroup = age > 60 ? 'over60' : 'under60';
	const activityLevel = activityFactor >= 4 ? 'high' : 'low';
	// Define base ratios for carbohydrate intake based on health goal
	const baseRatios = {
		maintenance: 0.5,
		musclegain: 0.6,
		fatloss: 0.3,
		weightloss: 0.4,
		weightgain: 0.7,
	};
	let carbRatio =
		(compositionPreference === 'omnivore' ? 0.3 : baseRatios[compositionGoal]) || baseRatios['maintenance'];
	const modifiers = {
		'over60': ageGroup === 'over60' ? 0.05 : -0.05,
		'pregnant': pregnant ? 0.1 : 0,
		'low-carb': compositionType === 'low-carb' ? -baseRatios[compositionGoal] + 0.25 : 0,
		'keto': compositionType === 'keto' ? -carbRatio + (0.1 - activityFactor / 1000) : 0,
		'highActivity': activityLevel === 'high' ? 0.1 : 0,
	};
	// Apply modifiers if conditions are true
	for (const modifier in modifiers) {
		carbRatio += modifiers[modifier];
	}
	return Math.round((remainingCalories * carbRatio) / 4);
};

module.exports = {
	calculateBMI,
	calculateBMR,
	calculateTDEE,
	calculateAdjustedTDEE,
	calculateProteins,
	calculateCarbs,
};
