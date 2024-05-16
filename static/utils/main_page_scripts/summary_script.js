const submitInfo = document.getElementById('submitDetails');
/* sends out the finalized information to the server */
submitInfo.addEventListener('click', (e) => {
	e.preventDefault();
	let mealPlan = JSON.parse(localStorage.getItem('order/choose-mealplan'));
	let userDetails = JSON.parse(localStorage.getItem('order/set-profile'));
	let userPreferences = JSON.parse(localStorage.getItem('order/nutritional-preference'));

	allUserInfo = { mealPlan, userDetails, userPreferences };

	fetch('/ordering-data', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(allUserInfo),
	}).catch((error) => {
		console.error('Error', error);
	});
});

/* dynamically renders a form for each profile */
function profileRendering(numberOfPeople) {
	allProfiles = document.getElementById('users');

	addUserDetails(1);

	for (let i = 0; i < numberOfPeople; i++) {
		profile = document.createElement('div');
		profileNumber = document.createElement('span');
		profileNumber.innerHTML = i + 1;
		profile.id = `profile${i + 1}`;
		allProfiles.append(profile);
		profile.append(profileNumber);

		if (i >= 1) {
			let form = document.getElementById('form1');
			newForm = form.cloneNode(true);
			newForm.class = `profile_form`;
			newForm.id = `form${i + 1}`;
			newForm.style.visibility = 'hidden';
			content = document.getElementById('step_content');
			content.appendChild(newForm);
			addUserDetails(i + 1);
		}
	}
}

/* adds user details to each box on the summary page */
function addUserDetails(formNumber) {
	const preferencesDetails = JSON.parse(localStorage.getItem('order/nutritional-preference'));
	const profileDetails = JSON.parse(localStorage.getItem('order/set-profile'));

	let userProfile = profileDetails[formNumber - 1];
	let userPreferences = preferencesDetails[formNumber - 1];

	let form = document.querySelector(`#form${formNumber}`);
	let healthDetailsParentContainer = form.querySelectorAll('#userHealthDetailsParentContainer');

	/* for cases where the profile is a woman then add two more boxes */
	if (userProfile['sex'] === 'female' && form.getElementsByClassName('pregOrLact').length < 1) {
		let pregnantOrLactating = document.createElement('div');
		pregnantOrLactating.innerHTML = detailsForWomen();
		healthDetailsParentContainer[1].appendChild(pregnantOrLactating.childNodes[0]);
		healthDetailsParentContainer[1].appendChild(pregnantOrLactating.childNodes[1]);
	} else if (userProfile['sex'] === 'male') {
	/* for cases where the profile is a man then remove the added boxes from when the profiles are rendered */
		let elements = form.getElementsByClassName('pregOrLact');
		console.log(elements.length);
		delete userPreferences.pregnant;
		delete userPreferences.lactating;

		while (elements.length > 0) {
			healthDetailsParentContainer[1].removeChild(elements[0]);
		}
	}

	/* fills out the user information in the boxes */
	let rightDetails = form.getElementsByClassName('detailsContent');

	let i = 0;
	for (let key in userProfile) {
		rightDetails[i].textContent = userProfile[key].charAt(0).toUpperCase() + userProfile[key].slice(1);
		i++;
	}

	for (let key in userPreferences) {
		rightDetails[i].textContent = userPreferences[key].charAt(0).toUpperCase() + userPreferences[key].slice(1);
		i++;
	}
}

const detailsForWomen = () => {
	return `<div class="pregOrLact" id="userHealthDetails">
                <span>Pregnant</span>
                <div id="userRightHealthDetailsContainer">
                    <span class="detailsContent">False</span>
                </div>
            </div>

            <div class="pregOrLact" id="userHealthDetails">
                <span>Lactating</span>
                <div id="userRightHealthDetailsContainer">
                    <span class="detailsContent">False</span>
                </div>
            </div>`;
};

/* gets item from localStorage and renders a number of forms depending on the users input given on the first page */
mealPlan = localStorage.getItem('order/choose-mealplan');
data = JSON.parse(mealPlan);

profileRendering(data.peopleAmount);

for (let i = 1; i <= data.peopleAmount; i++) {
	swapForms(`profile${i}`, `form${i}`);
}

/* makes it possible to swap between forms by clicking on the profile boxes */
function swapForms(profile, form) {
	document.getElementById(profile).addEventListener('click', function () {
		for (let i = 1; i <= data.peopleAmount; i++) {
			let formVisibility = document.getElementById(`form${i}`);
			let userColor = document.getElementById(`profile${i}`);
			userColor.style.height = '100%';
			userColor.style.backgroundColor = '#a0abc0';
			formVisibility.style.visibility = 'hidden';
		}

		userColor = document.getElementById(profile);
		userColor.style.backgroundColor = '#2d3648';
		userColor.style.height = '104%';

		formVisibility = document.getElementById(form);
		formVisibility.style.visibility = 'visible';
	});
}

/* loads header and footer */
document.addEventListener('DOMContentLoaded', function () {
	const headerContainer = document.getElementById('header-container');
	headerContainer.innerHTML = Header();
});

document.addEventListener('DOMContentLoaded', function () {
	const headerContainer = document.getElementById('footer-container');
	headerContainer.innerHTML = Footer();
});
