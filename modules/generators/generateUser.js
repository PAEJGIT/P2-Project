/**
 * Generates a random user object.
 * @returns {Object} A random user object.
 */
const generateRandomUser = () => {
	const names = ['Daniel Doe', 'Stefan Doe', 'Johannes Doe', 'Peter Doe'];
	const sexes = ['male', 'female'];
	const goals = ['maintenance', 'musclegain', 'fatloss', 'weightloss', 'weightgain'];
	const preferences = ['omnivore', 'vegetarian', 'vegan', 'balanced'];
	const types = ['keto', 'low-carb', 'high-fiber', 'balanced'];
	const activityFactors = [1, 2, 3, 4, 5];

	const name = names[Math.floor(Math.random() * names.length)];
	const sex = sexes[Math.floor(Math.random() * sexes.length)];
	const weight = sex === 'male' ? Math.round(Math.random() * 50 + 100) : Math.round(Math.random() * 40 + 60);
	const height = sex === 'male' ? Math.round(Math.random() * 70 + 150) : Math.round(Math.random() * 60 + 140);
	const activityFactor = activityFactors[Math.floor(Math.random() * activityFactors.length)];
	const age = activityFactor < 4 ? Math.round(Math.random() * 84 + 16) : Math.round(Math.random() * 40 + 16);
	const pregnant = sex === 'male' ? false : age < 60 ? (activityFactor > 3 ? false : Math.random() < 0.5 ? false : true) : false;
	const lactating = sex === 'male' ? false : age < 60 ? (activityFactor > 3 ? false : Math.random() < 0.5 ? false : true) : false;
	const compositionGoal = pregnant ? 'maintenance' : goals[Math.floor(Math.random() * goals.length)];
	const compositionPreference = pregnant ? 'balanced' : preferences[Math.floor(Math.random() * preferences.length)];
	const compositionType = pregnant ? 'balanced' : types[Math.floor(Math.random() * types.length)];

	return {
		name: name,
		sex: sex,
		weightKg: weight,
		heightCm: height,
		age: age,
		activityFactor: activityFactor,
		pregnant: pregnant,
		lactating: lactating,
		compositionGoal: compositionGoal,
		compositionPreference: compositionPreference,
		compositionType: compositionType,
	};
};

module.exports = generateRandomUser;
