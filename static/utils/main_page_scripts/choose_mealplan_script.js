let inputButton = document.getElementById("select_plan_submit");
inputButton.addEventListener("submit", updateCompletedSteps());

// if data already exists then set the default value to what the user had previously picked
if (localStorage.getItem('order/choose-mealplan')) {
    const formData = JSON.parse(localStorage.getItem('order/choose-mealplan'));

    let peopleRadios = document.getElementsByClassName('peopleRadios');
    let mealRadios = document.getElementsByClassName('mealRadios');

    for (let i = 0; i < peopleRadios.length; i++) {
    if (peopleRadios[i].value === formData.peopleAmount) {
        peopleRadios[i].checked = true;
        break;
     }
    }

    for (let i = 0; i < mealRadios.length; i++) {
    if (mealRadios[i].value === formData.mealAmount) {
        mealRadios[i].checked = true;
        break;
     }
    }
}


// Save form data to localStorage when user navigates away from the page
function saveChoice() {
    window.addEventListener('beforeunload', () => {
    let peopleRadios = document.getElementsByClassName('peopleRadios');
    let mealRadios = document.getElementsByClassName('mealRadios');

    let mealValue;
    let peopleValue;

    for (let i = 0; i < peopleRadios.length; i++) {
    if (peopleRadios[i].type === 'radio' && peopleRadios[i].checked) {
        peopleValue = peopleRadios[i].value;
        break;
     }
    }

     for (let i = 0; i < mealRadios.length; i++) {
     if (mealRadios[i].type === 'radio' && mealRadios[i].checked) {
        mealValue = mealRadios[i].value;
        break;
     }
    }

    const formData = {
        peopleAmount: peopleValue,
        mealAmount: mealValue
    };

    localStorage.setItem('order/choose-mealplan', JSON.stringify(formData));


});
}


let step2Page = "http://localhost:3262/order/set-profile";

let jsonData = localStorage.getItem("order/choose-mealplan");
let step1Data = JSON.parse(jsonData);


function nextPage(stepData, nextPage) {
if (!stepData) {
    window.alert("Please enter all your details!");
    return false;
 }

for (let key in stepData) {
    if (stepData[key] === null || stepData[key] === undefined || stepData[key] === '') {
        window.alert("Please enter all your details!");
        return false;
    }
}
window.location.href = nextPage;
}
