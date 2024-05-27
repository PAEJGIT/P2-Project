// Import Calculation functions
import {
	calculateAdjustedTDEE,
	calculateBMI,
	calculateBMR,
	calculateCarbs,
	calculateProteins,
	calculateTDEE,
} from './calculators.js';

// Create user profile object
let userProfile = {
	name: null,
	sex: null,
	age: null,
	weight: null,
	height: null,
	activity: null,
	healthGoal: null,
	nutritionalPreference: null,
	dietaryApproach: null,
	pregnant: null,
	lactating: null,
	BMI: null,
	BMR: null,
	TDEE: null,
	proteins: null,
	carbohydrates: null,
	fats: null,
};

document.addEventListener('DOMContentLoaded', function () {
	// Check if the user is logged in
	const username = localStorage.getItem('username');
	if (!username) {
		alert('Please login to continue. Redirecting to home page...');
		window.location.href = '../pages/home.html';
	}
	// Check if user profile is already saved in localStorage

	// Get all input fields
	const name = document.getElementById('selectedName');
	const sex = document.getElementById('selectedSex');
	const age = document.getElementById('selectedAge');
	const weight = document.getElementById('selectedWeight');
	const height = document.getElementById('selectedHeight');
	const activity = document.getElementById('selectedActivity');
	const healthGoal = document.getElementById('selectedHealthGoal');
	const nutritionalPreference = document.getElementById('selectedNutritionalPreference');
	const dietaryApproach = document.getElementById('selectedDietaryApproach');
	const pregnantLactate = document.getElementById('selectedPregnancy');

	// Function to update the welcome title
	function updateWelcomeTitle() {
		const name = document.getElementById('selectedName');
		const NAME_text = document.getElementById('name_text');
		const title = document.getElementById('user-welcome-title');
		if (name) {
			NAME_text.textContent = name.value.trim();
			title.textContent = `Hello ${name.value.trim()},`;
		} else {
			title.textContent = 'Hello,';
		}
	}
	// Function to toggle the pregnant/lactating section
	function togglePregnantLactateSection() {
		const pregnantLactateSection = document.getElementById('pregnant_lactating_section');
		if (sex.value === 'female') {
			pregnantLactateSection.style.marginTop = '1rem';
			pregnantLactateSection.style.display = 'contents';
		} else {
			pregnantLactateSection.style.display = 'none';
		}
	}

	// Initial check
	updateWelcomeTitle();
	togglePregnantLactateSection();

	// Event listeners for changes
	name.addEventListener('input', function () {
		updateWelcomeTitle();
		getFormData(); // Update form data when the name changes
	});

	// Event listener for changes
	sex.addEventListener('change', function () {
		togglePregnantLactateSection();
		getFormData(); // Call getFormData when the sex changes
	});

	// Add event listeners to all input fields
	name.addEventListener('change', getFormData);
	sex.addEventListener('change', getFormData);
	age.addEventListener('change', getFormData);
	weight.addEventListener('change', getFormData);
	height.addEventListener('change', getFormData);
	activity.addEventListener('change', getFormData);
	healthGoal.addEventListener('change', getFormData);
	nutritionalPreference.addEventListener('change', getFormData);
	dietaryApproach.addEventListener('change', getFormData);
	try {
		pregnantLactate.addEventListener('change', getFormData);
	} catch (error) {}
});

function getFormData() {
	// Calculation Values
	let BMI = 0;
	let BMR = 0;
	let TDEE = 0;
	let PROTEINS = 0;
	let CARBS = 0;
	let FATS = 0;

	// Get all values from input fields
	const nameValue = document.getElementById('selectedName').value;
	const sexValue = document.getElementById('selectedSex').value;
	const ageValue = document.getElementById('selectedAge').value;
	const weightValue = document.getElementById('selectedWeight').value;
	const heightValue = document.getElementById('selectedHeight').value;
	const activityValue = document.getElementById('selectedActivity').value;
	const healthGoalValue = document.getElementById('selectedHealthGoal').value;
	const nutritionalPreferenceValue = document.getElementById('selectedNutritionalPreference').value;
	const dietaryApproachValue = document.getElementById('selectedDietaryApproach').value;
	const pregnantValue =
		document.querySelectorAll('.stepper-button-radio')[1].classList[1] === 'selected' ? true : false;
	const lactatingValue =
		document.querySelectorAll('.stepper-button-radio')[2].classList[1] === 'selected' ? true : false;

	// Get ID's to display the values
	const BMR_text = document.getElementById('BMR_text');
	const TDEE_text = document.getElementById('TDEE_text');
	const PROTEINS_text = document.getElementById('PROTEINS_text');
	const CARBS_text = document.getElementById('CARBS_text');
	const FATS_text = document.getElementById('FATS_text');

	// Get ID's to display the summary values
	const NAME_summary = document.getElementById('NAME_summary');
	const HEALTHGOAL_summary = document.getElementById('HEALTHGOAL_summary');
	const PREFERENCE_summary = document.getElementById('PREFERENCE_summary');
	const DIETARY_summary = document.getElementById('DIETARY_summary');
	const BMI_summary = document.getElementById('BMI_summary');
	const BMR_summary = document.getElementById('BMR_summary');
	const TDEE_summary = document.getElementById('TDEE_summary');
	const PROTEINS_summary = document.getElementById('PROTEINS_summary');
	const CARBS_summary = document.getElementById('CARBS_summary');
	const FATS_summary = document.getElementById('FATS_summary');

	// Calculate BMI
	if (weightValue && heightValue) {
		BMI = calculateBMI(weightValue, heightValue).toFixed(0);
	}

	// Calculate BMR
	if (sexValue && ageValue && weightValue && heightValue) {
		// Calculate BMR
		BMR = calculateBMR(sexValue, ageValue, weightValue, heightValue);
		// Add BMR to the BMR_text
		BMR_text.innerHTML = Math.round(BMR);
		// Hide loading indicator in BMR box
		const loadingIndicatorBMR = document.getElementById('loading_indicator_bmr');
		loadingIndicatorBMR.style.display = 'none';
	}

	// Calculate TDEE
	if (BMR != 0 && activityValue) {
		TDEE = calculateTDEE(BMR, activityValue);
		// Add TDEE to the TDEE_text
		TDEE_text.innerHTML = Math.round(TDEE);
		// Hide loading indicator in TDEE box
		const loadingIndicatorTDEE = document.getElementById('loading_indicator_tdee');
		loadingIndicatorTDEE.style.display = 'none';
	}

	// Calculate Adjusted TDEE
	if (TDEE != 0 && healthGoalValue) {
		TDEE = calculateAdjustedTDEE(TDEE, healthGoalValue);
		// Add TDEE to the TDEE_text
		TDEE_text.innerHTML = Math.round(TDEE);
	}

	// Calculate Proteins
	if (sexValue && ageValue && weightValue && activityValue && healthGoalValue && nutritionalPreferenceValue) {
		PROTEINS = calculateProteins(
			sexValue,
			ageValue,
			weightValue,
			activityValue,
			pregnantValue,
			lactatingValue,
			healthGoalValue,
			nutritionalPreferenceValue
		);
		// Add PROTEINS to the PROTEINS_text
		PROTEINS_text.innerHTML = Math.round(PROTEINS);
		// Hide loading indicator in PROTEINS box
		const loadingIndicatorPROTEINS = document.getElementById('loading_indicator_proteins');
		loadingIndicatorPROTEINS.style.display = 'none';
	}

	// Calculate Carbs & Fats
	let proteinCalories = PROTEINS * 4;
	let remainingCalories = TDEE - proteinCalories;
	if (
		remainingCalories &&
		ageValue &&
		activityValue &&
		healthGoalValue &&
		nutritionalPreferenceValue &&
		dietaryApproachValue
	) {
		CARBS = calculateCarbs(
			remainingCalories,
			ageValue,
			activityValue,
			pregnantValue,
			healthGoalValue,
			nutritionalPreferenceValue,
			dietaryApproachValue
		);
		// Add CARBS to the CARBS_text
		CARBS_text.innerHTML = Math.round(CARBS);
		// Hide loading indicator in CARBS box
		const loadingIndicatorCARBS = document.getElementById('loading_indicator_carbs');
		loadingIndicatorCARBS.style.display = 'none';

		// Calculate Fats
		const carbCalories = CARBS * 4;
		remainingCalories = TDEE - proteinCalories - carbCalories;
		// Assuming fats provide 9 calories per gram, calculate fat requirements
		FATS = Math.round(remainingCalories / 9);
		// Add FATS to the FATS_text
		FATS_text.innerHTML = Math.round(FATS);
		// Hide loading indicator in CARBS box
		const loadingIndicatorFATS = document.getElementById('loading_indicator_fats');
		loadingIndicatorFATS.style.display = 'none';
	}

	// Change the summary values
	NAME_summary.innerHTML = nameValue;
	HEALTHGOAL_summary.innerHTML =
		healthGoalValue === 'maintenance'
			? 'to maintain your current weight, we have made some adjustments to your daily calorie intake. We have not made any drastic changes to your daily calorie intake.'
			: healthGoalValue === 'musclegain'
			? "to induce muscular hypertrophy, we've increased your daily calorie and macronutrient intake, but not too much!"
			: healthGoalValue === 'fatloss'
			? "to focus on fat-loss, the calculations are designed to help you lose as little muscle as possible. We've made some adjustments to your daily calorie intake, but not too much. This is all part of our plan to help you achieve your fat loss goals."
			: healthGoalValue === 'weightloss'
			? 'to lose pure weight, we have made some adjustments to your daily calorie intake. We have reduced your daily calorie intake to help you achieve your weight loss goals.'
			: 'to gain weight, we have made some adjustments to your daily calorie intake. We have increased your daily calorie intake to help you achieve your weight gain goals.';
	PREFERENCE_summary.innerHTML =
		nutritionalPreferenceValue === 'omnivore'
			? 'For example, we have placed you on an omnivore diet and adjusted your macros accordingly.'
			: nutritionalPreferenceValue === 'vegetarian'
			? "For example, since you have choosen a vegetarian diet, we've increased your protein intake a little to make up for the lower protein content."
			: nutritionalPreferenceValue === 'vegan'
			? 'For example, since you have choosen a vegan diet, we have increased your protein intake to make up for the lower protein content.'
			: 'Since you have chosen a balanced diet, we have adjusted your macros accordingly.';
	DIETARY_summary.innerHTML =
		dietaryApproachValue === 'balanced'
			? 'Besides this, with an balanced approach to your diet, the macro ratios should perfectly match your needs.'
			: dietaryApproachValue === 'keto'
			? 'Besides this, with a keto approach to your diet, we have adjusted your macros accordingly.'
			: dietaryApproachValue === 'highFiber'
			? 'Besides this, with a high-fiber approach to your diet, we have adjusted your macros accordingly.'
			: 'Besides this, with a low-carb approach to your diet, we have adjusted your macros accordingly.';
	BMI_summary.innerHTML = BMI;
	BMR_summary.innerHTML = Math.round(BMR) + ' cal';
	TDEE_summary.innerHTML = Math.round(TDEE) + ' cal';
	PROTEINS_summary.innerHTML = Math.round(PROTEINS) + 'g';
	CARBS_summary.innerHTML = Math.round(CARBS) + 'g';
	FATS_summary.innerHTML = Math.round(FATS) + 'g';

	// Save all to localStorage
	userProfile = {
		name: nameValue,
		sex: sexValue,
		age: ageValue,
		weight: weightValue,
		height: heightValue,
		activity: activityValue,
		healthGoal: healthGoalValue,
		nutritionalPreference: nutritionalPreferenceValue,
		dietaryApproach: dietaryApproachValue,
		pregnant: pregnantValue,
		lactating: lactatingValue,
		BMI: BMI,
		BMR: BMR,
		TDEE: TDEE,
		proteins: PROTEINS,
		carbohydrates: CARBS,
		fats: FATS,
	};

	localStorage.setItem('userProfile', JSON.stringify(userProfile));

	// Get current username from localStorage
	const username = localStorage.getItem('username');

	// Update user profile in accounts.json
	async function updateUserProfile() {
		const userProfile = JSON.parse(localStorage.getItem('userProfile'));

		const response = await fetch('/updateProfile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, userProfile }, null, 2),
		});

		if (response.ok) {
			console.log('Profile updated successfully');
		} else {
			console.error('Failed to update profile');
		}
	}
	updateUserProfile();
}
