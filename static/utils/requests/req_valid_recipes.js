document.addEventListener('DOMContentLoaded', function () {
	// Get localStorage
	const localStorage = window.localStorage;
	// Get user info from localStorage
	const localUser = JSON.parse(localStorage.getItem('userProfile'));

	console.log('User info: ');
	console.table(localUser);

	const userProfile = {
		peopleAmount: 1,
		mealAmount: 3,
		sex: localUser.sex,
		age: localUser.age,
		heightCm: localUser.height,
		weightKg: localUser.weight,
		activityFactor: localUser.activity,
		pregnant: localUser.pregnant,
		lactating: localUser.lactating,
		compositionGoal: localUser.healthGoal,
		compositionPreference: localUser.nutritionalPreference,
		compositionType: localUser.dietaryApproach
	};
	//console.table(userData);
	reqValidRecipes(userProfile, (data) => {
		// Call function that runs the choosers
		addBreakfastRecipes(data);
	});
});

function reqValidRecipes(userProfile, callback) {
	console.table(userProfile);
	fetch('/validRecipes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userProfile }),
	})
		.then((response) => response.json())
		.then((data) => {
			callback(data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}
