document.addEventListener('DOMContentLoaded', function () {
	const userProfile = {
		peopleAmount: JSON.parse(localStorage.getItem('order/choose-mealplan')).peopleAmount,
		mealAmount: JSON.parse(localStorage.getItem('order/choose-mealplan')).mealAmount,
		sex: JSON.parse(localStorage.getItem('order/set-profile'))[0].sex,
		age: JSON.parse(localStorage.getItem('order/set-profile'))[0].age,
		heightCm: JSON.parse(localStorage.getItem('order/set-profile'))[0].height,
		weightKg: JSON.parse(localStorage.getItem('order/set-profile'))[0].weight,
		activityFactor: JSON.parse(localStorage.getItem('order/set-profile'))[0].activitylevel,
		pregnant: '',
		lactating: '',
		compositionGoal: JSON.parse(localStorage.getItem('order/nutritional-preference'))[0].healthgoal,
		compositionPreference: JSON.parse(localStorage.getItem('order/nutritional-preference'))[0].dietpreference,
		compositionType: JSON.parse(localStorage.getItem('order/nutritional-preference'))[0].diettype,
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
