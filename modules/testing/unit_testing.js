const log = require('../utils/log');
const calculateBMI = require('../calculators/calculators').calculateBMI;
const calculateBMR = require('../calculators/calculators').calculateBMR;
const calculateTDEE = require('../calculators/calculators').calculateTDEE;
const calculateAdjustedTDEE = require('../calculators/calculators').calculateAdjustedTDEE;
const calculateProteins = require('../calculators/calculators').calculateProteins;
const calculateCarbs = require('../calculators/calculators').calculateCarbs;

// Assert
const assert = (fn, description, condition) => {
	if (!condition) {
		log.error(fn, 'assert', 'ERROR', `${description}`);
	} else {
		log.success(fn, 'assert', 'SUCCESS', `${description}`);
	}
};

const test = (fn) => {
	try {
		fn();
	} catch (error) {
		console.error(error);
	}
};

const testCalculateBMI = () => {
	log.info(__filename, 'testCalculateBMI', 'INFO', 'Running tests for calculateBMI function', true, true, true);
	test(() => {
		const result = calculateBMI(70, 175);
		assert(testCalculateBMI.name, 'Correctly calculates BMI to 22.86', Math.abs(result - 22.86) < 0.01);
	});
	test(() => {
		try {
			calculateBMI(0, 175);
		} catch (error) {
			assert(testCalculateBMI.name, 'Correctly throws error for invalid weight input value.', true);
		}
	});
	test(() => {
		try {
			calculateBMI(70, 0);
		} catch (error) {
			assert(testCalculateBMI.name, 'Correctly throws error for invalid height input value.', true);
		}
	});
};

const testCalculateBMR = () => {
	log.info(__filename, 'testCalculateBMR', 'INFO', 'Running tests for calculateBMR function', true, true, true);
	test(() => {
		const result = calculateBMR('male', 25, 70, 175);
		assert(testCalculateBMR.name, 'Correctly calculates BMR for male', Math.abs(result - 1724.05) < 0.01);
	});
	test(() => {
		const result = calculateBMR('female', 25, 50, 160);
		assert(testCalculateBMR.name, 'Correctly calculates BMR for female', Math.abs(result - 1297.373) < 0.01);
	});
	test(() => {
		try {
			calculateBMR('male', 0, 70, 175);
		} catch (error) {
			assert(testCalculateBMR.name, 'Correctly throws error for non-positive age', true);
		}
	});
};

const testCalculateTDEE = () => {
	log.info(__filename, 'testCalculateTDEE', 'INFO', 'Running tests for calculateTDEE function', true, true, true);
	test(() => {
		const BMR = calculateBMR('male', 25, 70, 175); // Example BMR for a male
		const result = calculateTDEE(BMR, 3);
		assert(
			testCalculateTDEE.name,
			'Correctly calculates TDEE with activity level',
			Math.abs(result - 2672.28) < 0.01
		);
	});
	test(() => {
		try {
			calculateTDEE(1655.1, 6); // Invalid activity level
		} catch (error) {
			assert(testCalculateTDEE.name, 'Correctly throws error for invalid activity level', true);
		}
	});
};

const testCalculateAdjustedTDEE = () => {
	log.info(
		__filename,
		'testCalculateAdjustedTDEE',
		'INFO',
		'Running tests for calculateAdjustedTDEE function',
		true,
		true,
		true
	);
	test(() => {
		const TDEE = 2672.28; // Example TDEE
		const result = calculateAdjustedTDEE(TDEE, 'musclegain');
		const roundToNearest = (numberToRound, toNearestNumber) =>
			Math.round(numberToRound / toNearestNumber) * toNearestNumber;
		assert(
			testCalculateAdjustedTDEE.name,
			'Correctly calculates adjusted TDEE for muscle gain',
			roundToNearest(Math.abs(result - (TDEE + 300)), 50) < 0.01
		);
	});
	test(() => {
		try {
			calculateAdjustedTDEE(2565.4, 'invalidGoal'); // Invalid goal
		} catch (error) {
			assert(testCalculateAdjustedTDEE.name, 'Correctly throws error for invalid health goal', true);
		}
	});
};

const testCalculateProteins = () => {
	log.info(
		__filename,
		'testCalculateProteins',
		'INFO',
		'Running tests for calculateProteins function',
		true,
		true,
		true
	);
	test(() => {
		const result = calculateProteins('male', 25, 70, 3, false, false, 'maintenance', 'vegan');
		assert(testCalculateProteins.name, 'Correctly calculates proteins requirement', Math.abs(result - 91) < 0.01);
	});
	test(() => {
		try {
			calculateProteins('other', 25, 70, 3, false, false, 'maintenance', 'omnivore'); // Invalid sex
		} catch (error) {
			assert(testCalculateProteins.name, 'Correctly throws error for invalid sex', true);
		}
	});
};

const testCalculateCarbs = () => {
	log.info(__filename, 'testCalculateCarbs', 'INFO', 'Running tests for calculateCarbs function', true, true, true);
	test(() => {
		const result = calculateCarbs(2000, 25, 3, false, 'maintenance', 'vegan', 'balanced');
		assert(testCalculateCarbs.name, 'Correctly calculates carbohydrates intake', Math.abs(result - 225) < 0.01);
	});
	test(() => {
		try {
			calculateCarbs(2000, 25, 3, false, 'invalidGoal', 'omnivore', 'balanced'); // Invalid goal
		} catch (error) {
			assert(testCalculateCarbs.name, 'Correctly throws error for invalid health goal', true);
		}
	});
};

const runAllTests = () => {
	const tests = [
		testCalculateBMI,
		testCalculateBMR,
		testCalculateTDEE,
		testCalculateAdjustedTDEE,
		testCalculateProteins,
		testCalculateCarbs,
	];
	tests.forEach((test) => test());
};

runAllTests();
