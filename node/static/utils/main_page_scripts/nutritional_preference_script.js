document.addEventListener("DOMContentLoaded", function () {
    const headerContainer = document.getElementById("header-container");
    headerContainer.innerHTML = Header();
});
document.addEventListener("DOMContentLoaded", function () {
    const headerContainer = document.getElementById("footer-container");
    headerContainer.innerHTML = Footer();
});


const createCheckboxForWomen = () => {
    return `<div class="checkboxesParentContainer"> 
                <div class="inputText"> 
                    <label for="select_checkbox" id="label_checkbox">eagaegea ?</label>
                    <span>gkrsfog</span>
                </div>

                <div id="lactAndPregnantCheckboxes"> 
                    <input type="checkbox" name="pregnant" id="pregnant" value="True"/>
                    <input type="checkbox" name="lactating" id="lactating" value="True"/>

                    <label id="labelPregnant" for="pregnant">Pregnant</label>
                    <label id="labelLactating" for="lactating">Lactating</label>
                </div>

            </div>
            `}

/* dynamically renders a form for each profile */
function profileRendering(numberOfPeople) {
        allProfiles = document.getElementById("users");

        createCheckboxes(1);
        
        for (let i = 0; i < numberOfPeople; i++) {
            profile = document.createElement("div");
            profileNumber = document.createElement("span");
            profileNumber.innerHTML = i + 1;
            profile.id = `profile${i + 1}`;

            allProfiles.append(profile);
            profile.append(profileNumber);

            if (i >= 1) {
                let form = document.getElementById("form1");
                newForm = form.cloneNode(true);
                newForm.class = `profile_form`;
                newForm.id = `form${i + 1}`;
                newForm.style.visibility = "hidden";
                content = document.getElementById("step_content");
                content.appendChild(newForm);
                
                addChildIds(i + 1);
                createCheckboxes(i + 1);
            }
        }
    }

function createCheckboxes(formNumber) {

    const profileDetails = JSON.parse(localStorage.getItem('order/set-profile'));
    let userProfile = profileDetails[formNumber - 1];
    let form = document.querySelector(`#form${formNumber}`);

    if (userProfile["sex"] === "female" && form.getElementsByClassName("checkboxesParentContainer").length === 0) {
        let newCheckbox = document.createElement('div');
        newCheckbox.innerHTML = createCheckboxForWomen();
        form.insertBefore(newCheckbox, form.lastElementChild);
        console.log(formNumber);					
    } else if (userProfile["sex"] === "male") {
        let checkboxes = form.getElementsByClassName("checkboxesParentContainer");

        while (checkboxes.length > 0) {
            checkboxes[0].parentNode.removeChild(checkboxes[0]);
        }

    }

}

/* adds unique child ids for new forms that are created */
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

/* gets item from localStorage and renders a number of forms depending on the users input given on the first page */
mealPlan = localStorage.getItem("order/choose-mealplan");
data = JSON.parse(mealPlan);

profileRendering(data.peopleAmount);

for (let i = 1; i <= data.peopleAmount; i++) {
    swapForms(`profile${i}`, `form${i}`);
}

/* makes it possible to swap between forms by clicking on the profile boxes */
function swapForms(profile, form) {
    document.getElementById(profile).addEventListener("click", function () {
        for (let i = 1; i <= data.peopleAmount; i++) {
            let formVisibility = document.getElementById(`form${i}`);
            let userColor = document.getElementById(`profile${i}`)
            userColor.style.height = "100%";
            userColor.style.backgroundColor = "#a0abc0"
            formVisibility.style.visibility = "hidden";
        }

        userColor = document.getElementById(profile);
        userColor.style.backgroundColor = "#2d3648"
        userColor.style.height = "104%";

        formVisibility = document.getElementById(form);
        formVisibility.style.visibility = "visible";
    });
}

/* saves form data before user clicks away from the page */
window.addEventListener("beforeunload", () => {
let allFormsData = [];

for (let i = 1; i <= data.peopleAmount; i++) {
    let getEachForm = document.getElementById(`form${i}`)
    let formData = new FormData(getEachForm);
    let obj = Object.fromEntries(formData);
    allFormsData.push(obj);

    localStorage.setItem('order/nutritional-preference', JSON.stringify(allFormsData));
}
});


/* fills out the forms with data the user had previously written before they left the page */
if (localStorage.getItem('order/nutritional-preference')) {
const formData = JSON.parse(localStorage.getItem('order/nutritional-preference'));
document.getElementById("select_health_goal").value = formData[0].healthgoal;
document.getElementById("select_diet_preference").value = formData[0].dietpreference;
document.getElementById("select_diet_type").value = formData[0].diettype;
saveCheckBoxValue(formData, 0);

for (let i = 2, k = 1; i <= data.peopleAmount; i++, k++) {
    document.getElementById(`select_health_goal${i}`).value = formData[`${k}`].healthgoal;
    document.getElementById(`select_diet_preference${i}`).value = formData[`${k}`].dietpreference;
    document.getElementById(`select_diet_type${i}`).value = formData[`${k}`].diettype;		
}
}

/* reloads the page. this is necessary to update new data */
reloadPage();	

function reloadPage() {
            window.onload = function() {
        if (!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }
    }
}

function saveCheckBoxValue(formData, formNumber) {

    if (formData[formNumber].lactating && formData[formNumber].pregnant) {
            document.getElementById("pregnant").checked = true; 
            document.getElementById("lactating").checked = true; 
        }
        else if (formData[formNumber].lactating) {
            document.getElementById("lactating").checked = true; 
        }
        else if (formData[formNumber].pregnant) {
            document.getElementById("pregnant").checked = true; 
        }
}