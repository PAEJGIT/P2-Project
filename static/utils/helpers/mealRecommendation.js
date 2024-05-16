//const recipes = require("../data/recipes.json");

const calcTDEE = (weight, height, age, activityLevel) => {
	const bmr = (10 * weight + 6.25 * height - 5 * age + 5).toFixed(0);
	switch (activityLevel) {
		case 0:
			return (bmr * 1.2).toFixed(0);
		case 1:
			return (bmr * 1.375).toFixed(0);
		case 2:
			return (bmr * 1.55).toFixed(0);
		case 3:
			return (bmr * 1.725).toFixed(0);
		case 4:
			return (bmr * 1.9).toFixed(0);
		default:
			return (bmr * 1.2).toFixed(0);
	}
};

const calcNutritionalValues = (height, weight, age, activityLevel) => {
	const tdee = calcTDEE(weight, height, age, activityLevel);
	const protein = (weight * 1.2).toFixed(0);
	const fat = ((tdee * 0.25) / 9).toFixed(0);
	const carbs = ((tdee - protein * 4 - fat * 9) / 4).toFixed(0);
	const bmi = (weight / (height * height)).toFixed(1);
	return { tdee, protein, carbs, fat };
};

const mealRecommendation = (recipes, weight, height, age, activityLevel) => {
	const { tdee, protein, carbs, fat, bmi } = calcNutritionalValues(weight, height, age, activityLevel);
	const target = { proteins: protein, carbs: carbs, fats: fat };
	console.table({ tdee, protein, carbs, fat, bmi });
	const groupedByType = {
		breakfast: recipes.filter((item) => item["mealTypes"][0] === 1),
		lunch: recipes.filter((item) => item["mealTypes"][1] === 1),
		dinner: recipes.filter((item) => item["mealTypes"][2] === 1),
	};

	let result = {
		breakfast: { name: "", servings: 0, calories: 0, proteins: 0, carbs: 0, fats: 0 },
		lunch: { name: "", servings: 0, calories: 0, proteins: 0, carbs: 0, fats: 0 },
		dinner: { name: "", servings: 0, calories: 0, proteins: 0, carbs: 0, fats: 0 },
		totals: { calories: 0, proteins: 0, carbs: 0, fats: 0 },
	};

	const findBestFit = (mealType, remaining) => {
		let bestFit = null;
		let minDifference = Infinity;
		groupedByType[mealType].forEach((recipe) => {
			let multiplier = 1;
			let diff =
				Math.abs(recipe.macroRatio[1] * multiplier - remaining.proteins) +
				Math.abs(recipe.macroRatio[2] * multiplier - remaining.carbs) +
				Math.abs(recipe.macroRatio[3] * multiplier - remaining.fats);

			while (diff < minDifference) {
				minDifference = diff;
				bestFit = { ...recipe, servings: multiplier };
				multiplier++; // Increase multiplier to see if more servings provide a closer fit
				diff =
					Math.abs(recipe.macroRatio[1] * multiplier - remaining.proteins) +
					Math.abs(recipe.macroRatio[2] * multiplier - remaining.carbs) +
					Math.abs(recipe.macroRatio[3] * multiplier - remaining.fats);
			}
		});
		return bestFit;
	};

	["breakfast", "lunch", "dinner"].forEach((mealType) => {
		const bestFit = findBestFit(mealType, target);
		if (bestFit) {
			result[mealType].name = bestFit.name;
			result[mealType].servings = bestFit.servings;
			result[mealType].calories = bestFit.macroRatio[0] * bestFit.servings;
			result[mealType].proteins = bestFit.macroRatio[1] * bestFit.servings;
			result[mealType].carbs = bestFit.macroRatio[2] * bestFit.servings;
			result[mealType].fats = bestFit.macroRatio[3] * bestFit.servings;

			// Update remaining target macros
			target.proteins -= result[mealType].proteins;
			target.carbs -= result[mealType].carbs;
			target.fats -= result[mealType].fats;

			// Update total macros
			result.totals.calories += result[mealType].calories;
			result.totals.proteins += result[mealType].proteins;
			result.totals.carbs += result[mealType].carbs;
			result.totals.fats += result[mealType].fats;
		}
	});

	return result;
};
