/* dynamically renders a form for each profile */
function profileRendering(numberOfPeople) {
	allProfiles = document.getElementById('users');

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
			addChildIds(i + 1);
		}
	}
}

function addChildIds(formNumber) {
	let childInputs = document.querySelectorAll(`#form${formNumber} input`);
	let childSelects = document.querySelectorAll(`#form${formNumber} select`);

	let firstFormInputs = document.querySelectorAll(`#form1 input`);
	let firstFormSelects = document.querySelectorAll(`#form1 select`);

	for (let i = 0; i < childInputs.length; i++) {
		childInputs[i].id = firstFormInputs[i].id + `${formNumber}`;
	}

	for (let i = 0; i < childSelects.length; i++) {
		childSelects[i].id = firstFormSelects[i].id + `${formNumber}`;
	}
}

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

/* Saves all form data to localStorage when user navigates away from the page */

window.addEventListener('beforeunload', () => {
	let allFormsData = [];

	for (let i = 1; i <= data.peopleAmount; i++) {
		let getEachForm = document.getElementById(`form${i}`);
		let formData = new FormData(getEachForm);
		let obj = Object.fromEntries(formData);
		allFormsData.push(obj);

		localStorage.setItem('order/set-profile', JSON.stringify(allFormsData));
	}
});

reloadPage();

function reloadPage() {
	window.onload = function () {
		if (!window.location.hash) {
			window.location = window.location + '#loaded';
			window.location.reload();
		}
	};
}

/* checks if existing form data is available. if it is then assign the values to the input fields */
if (localStorage.getItem('order/set-profile')) {
	const formData = JSON.parse(localStorage.getItem('order/set-profile'));
	(document.getElementById('select_sex').value = formData[0].sex),
		(document.getElementById('age').value = formData[0].age),
		(document.getElementById('height').value = formData[0].height),
		(document.getElementById('weight').value = formData[0].weight),
		(document.getElementById('select_activity').value = formData[0].activitylevel);

	for (let i = 2, k = 1; i <= data.peopleAmount; i++, k++) {
		(document.getElementById(`select_sex${i}`).value = formData[`${k}`].sex),
			(document.getElementById(`age${i}`).value = formData[`${k}`].age),
			(document.getElementById(`height${i}`).value = formData[`${k}`].height),
			(document.getElementById(`weight${i}`).value = formData[`${k}`].weight),
			(document.getElementById(`select_activity${i}`).value = formData[`${k}`].activitylevel);
	}
}

function previousPage(previousPage) {
	location.assign(previousPage);
}