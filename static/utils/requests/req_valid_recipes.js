import { log } from '../helpers/log.js';
const ENABLE_LOGGING = true;

document.addEventListener('DOMContentLoaded', function () {
	// Get localStorage
	const localStorage = window.localStorage;
	// Get user info from localStorage
	const localUser = JSON.parse(localStorage.getItem('userProfile'));
	log.table(localUser, ENABLE_LOGGING);

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
		compositionType: localUser.dietaryApproach,
	};

	// Get ID of overlay w. loading indicator [active by default]
	const overlay = document.getElementById('overlay');
	const overlayText = document.getElementById('overlay-text');
	// Function to show overlay with fade-in effect
	function showOverlay() {
		overlay.style.display = 'flex';
		requestAnimationFrame(() => {
			overlay.classList.add('active');
		});
	}
	// Function to hide overlay with fade-out effect
	function hideOverlay() {
		overlay.classList.remove('active');
		overlay.addEventListener(
			'transitionend',
			function handleTransitionEnd() {
				overlay.style.display = 'none';
				overlay.removeEventListener('transitionend', handleTransitionEnd);
			},
			{ once: true }
		);
	}
	showOverlay();
	const randomLoadingText = [
		'Crunching the numbers...',
		'Calculating the best recipes...',
		'Finding the perfect match...',
		'Looking for the best recipes...',
		'Checking the pantry...',
		'Gathering fresh ingredients...',
		'Slicing and dicing...',
		'Blending the flavors...',
		'Marinating the ideas...',
		'Simmering the suggestions...',
		'Whisking up something special...',
		'Preheating the oven...',
		'Mixing the perfect ingredients...',
		'Searching for tasty options...',
		'Cooking up a storm...',
		'Plating the deliciousness...',
		'Stirring up some goodness...',
		'Chopping the veggies...',
		'Baking up a treat...',
		'Grilling the options...',
		'Kneading the dough...',
		'Selecting nutritious choices...',
		'Preparing a healthy feast...',
	];
	setInterval(() => {
		// Set random loading text
		overlayText.textContent = randomLoadingText[Math.floor(Math.random() * randomLoadingText.length)];
	}, 1300);
	log.debug('req_valid_recipes.js', 'Document', 'INFO', 'Requesting Recipes', ENABLE_LOGGING);

	reqValidRecipes(userProfile, (data) => {
		// Call function that runs the choosers
		//addBreakfastRecipes(data);

		// Hide overlay
		hideOverlay();
		addRecipesToList(data);

		// Log
		log.debug('req_valid_recipes.js', 'Document', 'INFO', 'Done', ENABLE_LOGGING);

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
			log.error("reqValidRecipes", null, 'ERROR', error, ENABLE_LOGGING);
		});
}
