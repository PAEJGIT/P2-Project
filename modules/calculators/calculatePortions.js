function calculateMealPortions(targetMacros, meals) {
	let maxPortionSize = 6;
	let bestPortions = { breakfast: 0, lunch: 0, dinner: 0 };
	let bestTotals = { calories: 0, protein: 0, carb: 0, fat: 0 };
	let minError = Infinity;

	// Function to calculate total macros for given portions
	function calculateTotals(portions) {
		let totals = { calories: 0, protein: 0, carb: 0, fat: 0 };
		for (const meal of Object.keys(meals)) {
			for (const macro of Object.keys(totals)) {
				totals[macro] += meals[meal][macro] * portions[meal];
			}
		}
		return totals;
	}

	// Function to calculate the sum of absolute differences from target
	function calculateError(totals) {
		return (
			Math.abs((totals.calories - targetMacros.calories) / 5) +
			Math.abs(totals.protein - targetMacros.protein) +
			Math.abs(totals.carb - targetMacros.carb) +
			Math.abs(totals.fat - targetMacros.fat)
		);
	}

	// Try different combinations of portions up to a limit of maxPortionSize
	for (let b = 1; b <= maxPortionSize; b++) {
		for (let l = 1; l <= maxPortionSize; l++) {
			for (let d = 1; d <= maxPortionSize; d++) {
				let portions = { breakfast: b, lunch: l, dinner: d };
				let totals = calculateTotals(portions);
				let error = calculateError(totals);

				if (error < minError) {
					minError = error;
					bestPortions = portions;
					bestTotals = totals;
				}
			}
		}
	}

	let data = {
		bestPortions: bestPortions,
		bestTotals: bestTotals,
		minError: minError,
	};

	return data;
}

module.exports = calculateMealPortions;
