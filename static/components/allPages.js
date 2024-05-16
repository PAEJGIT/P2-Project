function updateCompletedSteps() {
	let links = document.getElementsByClassName('stepLinks');
	let icons = document.getElementsByClassName('step_icons');
	let containers = document.getElementsByClassName('linkContainers');
	let checkmarkIcons = document.getElementsByTagName('i');

	let stepsCompleted = 0;

	/* counts each consecutive completed step for the ordering process */
	for (let i = links.length - 1; i >= 0; i--) {
		if (localStorage.getItem(links[i].id) && hasNoEmptyValues(links[i].id)) {
			stepsCompleted++;
		} else {
			stepsCompleted = 0;
		}
	}

	/* assigns approiate values to each completed step (changes style indicating the step is completed and adds a link so the user can navigate back and forth) */
	for (let i = 0; i <= links.length - 1; i++) {
		if (i < stepsCompleted) {
			links[i].setAttribute('href', 'http://localhost:3262/' + links[i].id);
			links[i].style.color = 'black';
			icons[i].style =
				'filter: invert(0%) sepia(95%) saturate(21%) hue-rotate(2deg) brightness(92%) contrast(108%);';
			containers[i].style = 'background-color: rgba(158, 158, 158, 0.384);';
			checkmarkIcons[i].className = 'bi bi-check-circle';
		}

		if (i === stepsCompleted) {
			links[i].setAttribute('href', 'http://localhost:3262/' + links[i].id);
		}
	}
}

/* checks if local storage item has any empty values in it */
function hasNoEmptyValues(storageData) {
	let jsonData = localStorage.getItem(storageData);
	let obj = JSON.parse(jsonData);
	let bool;

	/* obj.length */
	/* since the functions differs from two different cases i have divided it into an if else statement (array of objects or a singular object) */
	if (obj.length >= 1) {
		for (let i = 0; i < 1; i++) {
			bool = checkForEmptyValues(obj[i]);
			if (bool === false) {
				return bool;
			}
		}
	} else {
		bool = checkForEmptyValues(obj);
	}
	return bool;
}

function checkForEmptyValues(object) {
	for (let key in object) {
		if (object[key] === null || object[key] === undefined || object[key] === '') {
			return false;
		}
	}
	return true;
}

document.addEventListener('DOMContentLoaded', updateCompletedSteps);
