
// Tons of event listeners on buttons
document.getElementById('left_arrow1').addEventListener('click', function() {
    scrollItems1('left');
});
document.getElementById('right_arrow1').addEventListener('click', function() {
    scrollItems1('right');
});
document.getElementById('left_arrow2').addEventListener('click', function() {
    scrollItems2('left');
});
document.getElementById('right_arrow2').addEventListener('click', function() {
    scrollItems2('right');
});
document.getElementById('left_arrow3').addEventListener('click', function() {
    scrollItems3('left');
});
document.getElementById('right_arrow3').addEventListener('click', function() {
    scrollItems3('right');
});

document.getElementById("accept1").addEventListener("click", function() {
    accept1();
});
document.getElementById("accept2").addEventListener("click", function() {
    accept2();
});
document.getElementById("accept3").addEventListener("click", function() {
    accept3();
});


/**
 * Scrolls the scrollbar based on the direction, which is given by the events above
 * @param {"string"} direction 
 */
function scrollItems1(direction) {
    var itemlist = document.getElementById('scrollBar1');
    var scrollAmount = 100;

    if (direction === 'right') {
        itemlist.scrollBy({left: scrollAmount, behavior: 'smooth'});
        if(currentCenterItemIndex < maxCenterItemIndex) {
            currentCenterItemIndex++;
        }
    } else {
        itemlist.scrollBy({left: -scrollAmount, behavior: 'smooth'});
        if(currentCenterItemIndex > 0) {
            currentCenterItemIndex--;
        }
    }
}

/**
 * Scrolls the scrollbar based on the direction, which is given by the events above
 * @param {"string"} direction 
 */
function scrollItems2(direction) {
    var itemlist = document.getElementById('scrollBar2');
    var scrollAmount = 100;

    if (direction === 'right') {
        itemlist.scrollBy({left: scrollAmount, behavior: 'smooth'});
        if(currentCenterItemIndex < maxCenterItemIndex) {
            currentCenterItemIndex++;
        }
    } else {
        itemlist.scrollBy({left: -scrollAmount, behavior: 'smooth'});
        if(currentCenterItemIndex > 0) {
            currentCenterItemIndex--;
        }
    }
}

/**
 * Scrolls the scrollbar based on the direction, which is given by the events above
 * @param {"string"} direction 
 */
function scrollItems3(direction) {
    var itemlist = document.getElementById('scrollBar3');
    var scrollAmount = 100;

    if (direction === 'right') {
        itemlist.scrollBy({left: scrollAmount, behavior: 'smooth'});
        if(currentCenterItemIndex < maxCenterItemIndex) {
            currentCenterItemIndex++;
        }
    } else {
        itemlist.scrollBy({left: -scrollAmount, behavior: 'smooth'});
        if(currentCenterItemIndex > 0) {
            currentCenterItemIndex--;
        }
    }
}


// Global Variables (Read names to understand usage :))
let currentCenterItemIndex = 0;

let maxCenterItemIndex = 0;

let globalValidRecipes;

let chosenBreakfastObj;
let chosenBreakfastName;

let chosenLunchObj;
let chosenLunchName;

let chosenDinnerObj;
let chosenDinnerName;


/**
 * Gotten from a fetch request!
 * @param {object} validRecipes 
 * 
 * Simply loops through the valid recipe object and adds divs based on the keys!
 * 
 * Also calculates the middle item of all items added, and scrolls the bar to the middle!
 */
function addBreakfastRecipes(validRecipes) {
    globalValidRecipes = validRecipes;
    let itemlist1 = document.getElementById("itemlist1");

    createInvisibleItem(itemlist1);
    createInvisibleItem(itemlist1);

    for(let recipe in globalValidRecipes) {
        let item = document.createElement('div');
        item.className = "item item1";
        item.textContent = globalValidRecipes[recipe].info.name;
        itemlist1.appendChild(item);
    }

    createInvisibleItem(itemlist1);
    createInvisibleItem(itemlist1);

    let items = document.querySelectorAll(".item1");
    currentCenterItemIndex = Math.floor(items.length/2);
    maxCenterItemIndex = items.length;

    let scrollBar1 = document.getElementById('scrollBar1')

    if(maxCenterItemIndex % 2 != 0) {
        scrollBar1.scrollLeft = ((scrollBar1.scrollWidth - scrollBar1.offsetWidth) - ((scrollBar1.scrollWidth - scrollBar1.offsetWidth)/maxCenterItemIndex))/2;
    } else {
        scrollBar1.scrollLeft = (scrollBar1.scrollWidth - scrollBar1.offsetWidth)/2;
    }
    
    document.getElementById("hidden1").classList.remove("invisible");

}


/**
 * Instead of taking the fetch request object, it uses the global valid recipe object! 
 * 
 * Simply loops through the valid recipe object and adds divs based on the keys!
 * 
 * Also calculates the middle item of all items added, and scrolls the bar to the middle!
 */
function addLunchRecipes() {
    let itemlist2 = document.getElementById("itemlist2");

    createInvisibleItem(itemlist2);
    createInvisibleItem(itemlist2);

    for(let recipe in chosenBreakfastObj) {
        if(recipe === "info") {
            continue;
        }
        let item = document.createElement('div');
        item.className = "item item2";
        item.textContent = chosenBreakfastObj[recipe].info.name;
        itemlist2.appendChild(item);
    }

    createInvisibleItem(itemlist2);
    createInvisibleItem(itemlist2);

    
    let items = document.querySelectorAll(".item2");
    currentCenterItemIndex = Math.floor(items.length/2);
    maxCenterItemIndex = items.length;
    
    let scrollBar2 = document.getElementById('scrollBar2')
    
    if(maxCenterItemIndex % 2 != 0) {
        scrollBar2.scrollLeft = ((scrollBar2.scrollWidth - scrollBar2.offsetWidth) - ((scrollBar2.scrollWidth - scrollBar2.offsetWidth)/maxCenterItemIndex))/2;
    } else {
        scrollBar2.scrollLeft = (scrollBar2.scrollWidth - scrollBar2.offsetWidth)/2;
    }

    document.getElementById("hidden2").classList.remove("invisible");
}


/**
 * Instead of taking the fetch request object, it uses the global valid recipe object! 
 * 
 * Simply loops through the valid recipe object and adds divs based on the keys!
 * 
 * Also calculates the middle item of all items added, and scrolls the bar to the middle!
 */
function addDinnerRecipes() {
    let itemlist3 = document.getElementById("itemlist3");

    createInvisibleItem(itemlist3);
    createInvisibleItem(itemlist3);

    for(let recipe in chosenLunchObj) {
        if(recipe === "info") {
            continue;
        }
        let item = document.createElement('div');
        item.className = "item item3";
        item.textContent = chosenLunchObj[recipe].info.name;
        itemlist3.appendChild(item);
    }

    createInvisibleItem(itemlist3);
    createInvisibleItem(itemlist3);

    
    let items = document.querySelectorAll(".item3");
    currentCenterItemIndex = Math.floor(items.length/2);
    maxCenterItemIndex = items.length;
    
    let scrollBar3 = document.getElementById('scrollBar3')
    
    if(currentCenterItemIndex % 2 == 0) {
        scrollBar3.scrollLeft = ((scrollBar3.scrollWidth - scrollBar3.offsetWidth) - ((scrollBar3.scrollWidth - scrollBar3.offsetWidth)/maxCenterItemIndex))/2;
    } else {
        scrollBar3.scrollLeft = (scrollBar3.scrollWidth - scrollBar3.offsetWidth)/2;
    }

    document.getElementById("hidden3").classList.remove("invisible");
}


/**
 * Takes a parent div to append the new div to and makes it invisible, because this allows the scrollable bar to have every item in the middle and not get capped from 2 elements on each corner :)
 * @param {HTMLElement} parent 
 */
function createInvisibleItem(parent) {
    let item = document.createElement('div');
    item.className = "item invisible";
    parent.appendChild(item);
}


/**
 * This is the function that runs when you click the accept button 1!
 * 
 * It disables the buttons, and locks in the currently centered item!
 */
function accept1() {

    let left_arrow = document.getElementById("left_arrow1");
    let right_arrow = document.getElementById("right_arrow1");
    let accept = document.getElementById("accept1");

    left_arrow.disabled = true;
    right_arrow.disabled = true;
    accept.disabled = true;

    
    let key = Object.keys(globalValidRecipes)[currentCenterItemIndex-1];
    chosenBreakfastObj = globalValidRecipes[key];
    chosenBreakfastName = globalValidRecipes[key].info.name;

    addLunchRecipes()
}

/**
 * This is the function that runs when you click the accept button 2!
 * 
 * It disables the buttons, and locks in the currently centered item!
 */
function accept2() {

    let left_arrow = document.getElementById("left_arrow2");
    let right_arrow = document.getElementById("right_arrow2");
    let accept = document.getElementById("accept2");

    left_arrow.disabled = true;
    right_arrow.disabled = true;
    accept.disabled = true;

    let keys = Object.keys(chosenBreakfastObj);
    keys.splice(0, 1);
    let key = keys[currentCenterItemIndex];
    chosenLunchObj = chosenBreakfastObj[key];
    chosenLunchName = chosenBreakfastObj[key].info.name;

    console.log(chosenLunchObj);

    addDinnerRecipes()
}

/**
 * This is the function that runs when you click the accept button 3!
 * 
 * It disables the buttons, and locks in the currently centered item!
 */
function accept3() {

    let left_arrow = document.getElementById("left_arrow3");
    let right_arrow = document.getElementById("right_arrow3");
    let accept = document.getElementById("accept3");

    left_arrow.disabled = true;
    right_arrow.disabled = true;
    accept.disabled = true;

    
    let keys = Object.keys(chosenLunchObj);
    keys.splice(0, 1);
    let key = keys[currentCenterItemIndex];
    chosenDinnerObj = chosenLunchObj[key];

    console.log(key);
    console.log(currentCenterItemIndex);
    console.log(chosenDinnerObj)

    chosenDinnerName = chosenLunchObj[key].info.name;

    console.log(chosenBreakfastName);
    console.log(chosenLunchName);
    console.log(chosenDinnerName);
    console.log(chosenDinnerObj.portions)
    console.log(chosenDinnerObj.macros)
}