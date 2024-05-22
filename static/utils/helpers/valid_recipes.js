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
	console.log(globalValidRecipes[recipe]);
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
				// Add or remove the recipe from the chosen recipes
				if (chosenRecipes.includes(recipe)) {
					chosenRecipes = chosenRecipes.filter((chosenRecipe) => chosenRecipe !== recipe);
				} else {
					chosenRecipes.push(recipe);
				}
				refreshList(chosenRecipes[chosenAmount]);
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

/**
 * Gotten from a fetch request!
 * @param {object} validRecipes
 *
 * Simply loops through the valid recipe object and adds divs based on the keys!
 *
 * Also calculates the middle item of all items added, and scrolls the bar to the middle!
 */
function addBreakfastRecipes(validRecipes) {
	// Get localStorage user info
	let userInfo = JSON.parse(localStorage.getItem('userProfile'));
	// Log the recipes and user info
	const show_recipes_in_log = false;
	const show_user_info_in_log = false;
	show_recipes_in_log ? console.log(validRecipes) : null;
	show_user_info_in_log ? console.log(userInfo) : null;

	globalValidRecipes = validRecipes;

	const itemlist1 = document.getElementById('itemlist1');

	createInvisibleItem(itemlist1);
	createInvisibleItem(itemlist1);

	for (let recipe in globalValidRecipes) {
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

		//equipment
		//macroRatio
		//mealTypes
		//categories
		//allergens
		//ingredients
		//ratings

		// Make card clickable and add event listener
		card.addEventListener('click', function () {
			// Change CSS of the card
			card.classList.toggle('card--active');
		});

		// Append the body to the card
		card.appendChild(body);
		// Append the card to the pop-over wrapper
		popOverWrapper.appendChild(card);
		// Append pop-over content to the pop-over wrapper
		popOverWrapper.appendChild(popOverContent);

		itemlist1.appendChild(popOverWrapper);
	}

	createInvisibleItem(itemlist1);
	createInvisibleItem(itemlist1);

	let items = document.querySelectorAll('.item1');
	currentCenterItemIndex = Math.floor(items.length / 2);
	maxCenterItemIndex = items.length;

	let scrollBar1 = document.getElementById('scrollBar1');

	if (maxCenterItemIndex % 2 != 0) {
		scrollBar1.scrollLeft =
			(scrollBar1.scrollWidth -
				scrollBar1.offsetWidth -
				(scrollBar1.scrollWidth - scrollBar1.offsetWidth) / maxCenterItemIndex) /
			2;
	} else {
		scrollBar1.scrollLeft = (scrollBar1.scrollWidth - scrollBar1.offsetWidth) / 2;
	}

	document.getElementById('hidden1').classList.remove('invisible');
}

/**
 * Instead of taking the fetch request object, it uses the global valid recipe object!
 *
 * Simply loops through the valid recipe object and adds divs based on the keys!
 *
 * Also calculates the middle item of all items added, and scrolls the bar to the middle!
 */
function addLunchRecipes() {
	let itemlist2 = document.getElementById('itemlist2');

	createInvisibleItem(itemlist2);
	createInvisibleItem(itemlist2);

	for (let recipe in chosenBreakfastObj) {
		if (recipe === 'info') {
			continue;
		}
		let item = document.createElement('div');
		item.className = 'item item2';
		item.textContent = chosenBreakfastObj[recipe].info.name;
		itemlist2.appendChild(item);
	}

	createInvisibleItem(itemlist2);
	createInvisibleItem(itemlist2);

	let items = document.querySelectorAll('.item2');
	currentCenterItemIndex = Math.floor(items.length / 2);
	maxCenterItemIndex = items.length;

	let scrollBar2 = document.getElementById('scrollBar2');

	if (maxCenterItemIndex % 2 != 0) {
		scrollBar2.scrollLeft =
			(scrollBar2.scrollWidth -
				scrollBar2.offsetWidth -
				(scrollBar2.scrollWidth - scrollBar2.offsetWidth) / maxCenterItemIndex) /
			2;
	} else {
		scrollBar2.scrollLeft = (scrollBar2.scrollWidth - scrollBar2.offsetWidth) / 2;
	}

	document.getElementById('hidden2').classList.remove('invisible');
}

/**
 * Instead of taking the fetch request object, it uses the global valid recipe object!
 *
 * Simply loops through the valid recipe object and adds divs based on the keys!
 *
 * Also calculates the middle item of all items added, and scrolls the bar to the middle!
 */
function addDinnerRecipes() {
	let itemlist3 = document.getElementById('itemlist3');

	createInvisibleItem(itemlist3);
	createInvisibleItem(itemlist3);

	for (let recipe in chosenLunchObj) {
		if (recipe === 'info') {
			continue;
		}
		let item = document.createElement('div');
		item.className = 'item item3';
		item.textContent = chosenLunchObj[recipe].info.name;
		itemlist3.appendChild(item);
	}

	createInvisibleItem(itemlist3);
	createInvisibleItem(itemlist3);

	let items = document.querySelectorAll('.item3');
	currentCenterItemIndex = Math.floor(items.length / 2);
	maxCenterItemIndex = items.length;

	let scrollBar3 = document.getElementById('scrollBar3');

	if (currentCenterItemIndex % 2 == 0) {
		scrollBar3.scrollLeft =
			(scrollBar3.scrollWidth -
				scrollBar3.offsetWidth -
				(scrollBar3.scrollWidth - scrollBar3.offsetWidth) / maxCenterItemIndex) /
			2;
	} else {
		scrollBar3.scrollLeft = (scrollBar3.scrollWidth - scrollBar3.offsetWidth) / 2;
	}

	document.getElementById('hidden3').classList.remove('invisible');
}

/**
 * Takes a parent div to append the new div to and makes it invisible, because this allows the scrollable bar to have every item in the middle and not get capped from 2 elements on each corner :)
 * @param {HTMLElement} parent
 */
function createInvisibleItem(parent) {
	let item = document.createElement('div');
	item.className = 'item invisible';
	parent.appendChild(item);
}

/**
 * This is the function that runs when you click the accept button 1!
 *
 * It disables the buttons, and locks in the currently centered item!
 */
function accept1() {
	let left_arrow = document.getElementById('left_arrow1');
	let right_arrow = document.getElementById('right_arrow1');
	let accept = document.getElementById('accept1');

	left_arrow.disabled = true;
	right_arrow.disabled = true;
	accept.disabled = true;

	let key = Object.keys(globalValidRecipes)[currentCenterItemIndex - 1];
	chosenBreakfastObj = globalValidRecipes[key];
	chosenBreakfastName = globalValidRecipes[key].info.name;

	addLunchRecipes();
}

/**
 * This is the function that runs when you click the accept button 2!
 *
 * It disables the buttons, and locks in the currently centered item!
 */
function accept2() {
	let left_arrow = document.getElementById('left_arrow2');
	let right_arrow = document.getElementById('right_arrow2');
	let accept = document.getElementById('accept2');

	left_arrow.disabled = true;
	right_arrow.disabled = true;
	accept.disabled = true;

	let keys = Object.keys(chosenBreakfastObj);
	keys.splice(0, 1);
	let key = keys[currentCenterItemIndex];
	chosenLunchObj = chosenBreakfastObj[key];
	chosenLunchName = chosenBreakfastObj[key].info.name;

	console.log(chosenLunchObj);

	addDinnerRecipes();
}

/**
 * This is the function that runs when you click the accept button 3!
 *
 * It disables the buttons, and locks in the currently centered item!
 */
function accept3() {
	let left_arrow = document.getElementById('left_arrow3');
	let right_arrow = document.getElementById('right_arrow3');
	let accept = document.getElementById('accept3');

	left_arrow.disabled = true;
	right_arrow.disabled = true;
	accept.disabled = true;

	let keys = Object.keys(chosenLunchObj);
	keys.splice(0, 1);
	let key = keys[currentCenterItemIndex];
	chosenDinnerObj = chosenLunchObj[key];

	console.log(key);
	console.log(currentCenterItemIndex);
	console.log(chosenDinnerObj);

	chosenDinnerName = chosenLunchObj[key].info.name;

	console.log(chosenBreakfastName);
	console.log(chosenLunchName);
	console.log(chosenDinnerName);
	console.log(chosenDinnerObj.portions);
	console.log(chosenDinnerObj.macros);
}
