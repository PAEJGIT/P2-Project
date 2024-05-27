// Variables
let currentCenterItemIndex = 0;
let maxCenterItemIndex = 0;
let globalValidRecipes;
let chosenBreakfastObj;
let chosenBreakfastName;
let chosenLunchObj;
let chosenLunchName;
let chosenDinnerObj;
let chosenDinnerName;

// Recipe storage for choosen recipes
let chosenRecipes = [];
let chosenAmount = 0;

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
function getUserProfile() {
	return JSON.parse(localStorage.getItem('userProfile'));
}
function fetchRecipes(recipes) {
	globalValidRecipes = recipes;
	return globalValidRecipes;
}
function emptyContainer() {
	const itemContainer = document.getElementById('item_container');
	itemContainer.innerHTML = '';
}
function refreshList(recipe) {
	emptyContainer();
	addRecipesToList(globalValidRecipes[recipe]);
}
function updateTitle(mealtype) {
	// Update title
	const mealType = mealtype === 0 ? 'Breakfast' : mealtype === 1 ? 'Lunch' : 'Dinner';
	document.getElementById('recipe_chooser_title').textContent = 'Choose ' + mealType;
	// Update description
	const description =
		mealtype === 0
			? 'Choose your first meal of the day. If you do not want the recommended meal, you can skip it and you will be shown a whole series of meals to choose from. After you have chosen, you will be directed to your next meal.'
			: mealtype === 1
			? 'Choose your second meal of the day. If you do not want the recommended meal, you can skip it and you will be shown a whole series of meals to choose from. After you have chosen, you will be directed to your next meal.'
			: 'End your day with a tasty dinner. If you do not want the recommended meal, you can skip it and you will be shown a whole series of meals to choose from. After you have chosen, you will be directed to your next meal.';
	document.getElementById('recipe_chooser_description').textContent = description;
}
function addRecipesToList(validRecipes) {
	// Get current username from localStorage
	const username = localStorage.getItem('username');
	// Fetch valid recipes
	let globalValidRecipes = fetchRecipes(validRecipes);
	// Get ID of item container
	const itemContainer = document.getElementById('item_container');

	for (let recipe in globalValidRecipes) {
		if (chosenAmount === 2) {
			showOverlay();
			// Save the chosen recipes to the local storage
			localStorage.setItem('chosenRecipes', JSON.stringify(chosenRecipes));
			// Update user profile in accounts.json
			async function updateUserProfile() {
				let userProfile = JSON.parse(localStorage.getItem('userProfile'));
				// Add the chosen recipes to the user profile
				userProfile.activeRecipes = chosenRecipes;
				// Add portions to each recipe
				const portions = globalValidRecipes.portions;
				userProfile.activeRecipes.forEach((recipe, index) => {
					recipe.portions = portions[index];
				});
				const response = await fetch('/updateProfile', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ username, userProfile }),
				});
				if (response.ok) {
					console.log('Profile updated successfully');
				} else {
					console.error('Failed to update profile');
				}
			}
			updateUserProfile();

			// Wait for the overlay to show and then redirect after 4 seconds
			setTimeout(() => {
				// Redirect to the dashboard
				window.location.href = '/dashboard';
			}, 4000);
		} else if (recipe === 'info') {
			continue;
		} else {

			// Create an pop-over wrapper
			let popOverWrapper = document.createElement('div');
			popOverWrapper.className = 'popover__wrapper';
			// Create pop-over content
			let popOverContent = document.createElement('div');
			popOverContent.className = 'popover__content';
			// Set the pop-over content to the macros of the recipe
			const { calories, protein, carb, fat } = globalValidRecipes[recipe].info;
			popOverContent.innerHTML = `<p>Calories: ${calories}</p> <p>Protein: ${protein}</p> <p>Carbs: ${carb}</p> <p>Fat: ${fat}</p>`;
			// Create a card for each recipe
			let card = document.createElement('div');
			card.className = 'card item1';

			// Make card clickable and add event listener
			card.addEventListener('click', function () {
				// Change CSS of the card
				card.classList.toggle('card--active');
				// Add the chosen recipe
				if (chosenRecipes.includes(recipe)) {
					chosenRecipes = chosenRecipes.filter((chosenRecipe) => chosenRecipe !== recipe);
				} else {
					chosenRecipes.push(globalValidRecipes[recipe].info);
				}
				refreshList(chosenRecipes[chosenAmount].name);
				chosenAmount++;
				updateTitle(chosenAmount);
			});

			// Create an image for each recipe
			let image = document.createElement('img');
			image.onerror = function () {
				// Test if the image is available
				image.src = '../../assets/images/1_oatmeal_with_apple.jpg';
			};
			image.src = '../../' + globalValidRecipes[recipe].info.image;
			image.className = 'card-img-top';
			card.appendChild(image);

			// Create a card body for each recipe
			let body = document.createElement('div');
			body.className = 'card-body';

			// Create a title for each recipe
			let title = document.createElement('h5');
			title.className = 'card-title';
			title.textContent = globalValidRecipes[recipe].info.name;
			body.appendChild(title);

			// Create a one or multiple tags for each recipe
			const tagContainer = document.createElement('div');
			tagContainer.className = 'tag-container';
			const tags = globalValidRecipes[recipe].info.tags;
			tags.forEach((tag) => {
				const tagElement = document.createElement('span');
				tagElement.className = 'badge badge-secondary';
				tagElement.textContent = tag;
				tagContainer.appendChild(tagElement);
			});
			body.appendChild(tagContainer);

			// Create a description for each recipe
			let descriptionContainer = document.createElement('div');
			let description = document.createElement('p');

			descriptionContainer.className = 'card-description-container';
			description.className = 'card-description';

			description.textContent = globalValidRecipes[recipe].info.description;
			descriptionContainer.appendChild(description);
			body.appendChild(descriptionContainer);

			// Container to contain preparation time and ratings
			let preparationTimeRatingContainer = document.createElement('div');
			preparationTimeRatingContainer.className = 'preparation-time-rating-container';

			// Create a preparation time for each recipe
			let preparationTimeContainer = document.createElement('div');
			let preparationTimeIcon = document.createElement('i');
			let preparationTimeText = document.createElement('p');
			preparationTimeContainer.className = 'preparation-time-container';
			preparationTimeIcon.className = 'preparation-time-icon';
			preparationTimeText.className = 'preparation-time';
			preparationTimeText.textContent = globalValidRecipes[recipe].info.preparationTime + ' minutes';
			preparationTimeContainer.appendChild(preparationTimeIcon);
			preparationTimeContainer.appendChild(preparationTimeText);

			// Create ratings for each recipe
			let ratingContainer = document.createElement('div');
			let ratingAverage = globalValidRecipes[recipe].info.ratings.averageRating; // 1-5
			let ratingNumberOf = globalValidRecipes[recipe].info.ratings.numberOfRatings;
			let ratingIconDefaultPath = '../../assets/icons/icon_star_default.svg';
			let ratingIconFilledPath = '../../assets/icons/icon_star_filled.svg';
			ratingContainer.className = 'rating-container';
			for (let i = 0; i < 5; i++) {
				let ratingIcon = document.createElement('img');
				ratingIcon.src = i < ratingAverage ? ratingIconFilledPath : ratingIconDefaultPath;
				ratingIcon.className = 'rating-icon';
				ratingContainer.appendChild(ratingIcon);
			}

			preparationTimeRatingContainer.appendChild(preparationTimeContainer);
			preparationTimeRatingContainer.appendChild(ratingContainer);
			body.appendChild(preparationTimeRatingContainer);

			// Append the body to the card
			card.appendChild(body);
			popOverWrapper.appendChild(popOverContent);
			// Append the card to the pop-over wrapper
			popOverWrapper.appendChild(card);
			itemContainer.appendChild(popOverWrapper);

			//* IGNORE
			// Append pop-over content to the pop-over wrapper
			//equipment
			//macroRatio
			//mealTypes
			//categories
			//allergens
			//ingredients
			//ratings
			//popOverWrapper.appendChild(popOverContent);
		}
	}
}
