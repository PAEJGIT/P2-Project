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

let currentCenterItemIndex = 0;

let maxCenterItemIndex = 0;

let globalValidRecipes;

let chosenBreakfastObj;
let chosenBreakfastName;

let chosenLunchObj;
let chosenLunchName;

let chosenDinnerObj;
let chosenDinnerName;


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
        scrollBar1.scrollLeft = ((scrollBar1.scrollWidth - scrollBar1.offsetWidth) - ((scrollBar1.scrollWidth - scrollBar1.offsetWidth)/maxCenterItemIndex*2.5))/2;
    } else {
        scrollBar1.scrollLeft = (scrollBar1.scrollWidth - scrollBar1.offsetWidth)/2;
    }
    
    document.getElementById("hidden1").classList.remove("invisible");

}



function addLunchRecipes() {
    let itemlist2 = document.getElementById("itemlist2");

    createInvisibleItem(itemlist2);
    createInvisibleItem(itemlist2);

    for(let recipe in chosenBreakfastObj) {
        if(recipe === "info") {
            console.log(recipe);
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
        scrollBar2.scrollLeft = ((scrollBar2.scrollWidth - scrollBar2.offsetWidth) - ((scrollBar2.scrollWidth - scrollBar2.offsetWidth)/maxCenterItemIndex*2.5))/2;
    } else {
        scrollBar2.scrollLeft = (scrollBar2.scrollWidth - scrollBar2.offsetWidth)/2;
    }

    document.getElementById("hidden2").classList.remove("invisible");
}



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
    
    if(maxCenterItemIndex % 2 != 0) {
        scrollBar3.scrollLeft = ((scrollBar3.scrollWidth - scrollBar3.offsetWidth) - ((scrollBar3.scrollWidth - scrollBar3.offsetWidth)/maxCenterItemIndex*2.5))/2;
    } else {
        scrollBar3.scrollLeft = (scrollBar3.scrollWidth - scrollBar3.offsetWidth)/2;
    }

    document.getElementById("hidden3").classList.remove("invisible");
}

function createInvisibleItem(parent) {
    let item = document.createElement('div');
    item.className = "item invisible";
    parent.appendChild(item);
}

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

function accept2() {

    let left_arrow = document.getElementById("left_arrow2");
    let right_arrow = document.getElementById("right_arrow2");
    let accept = document.getElementById("accept2");

    left_arrow.disabled = true;
    right_arrow.disabled = true;
    accept.disabled = true;


    console.log(Object.keys(chosenBreakfastObj));
    let key = Object.keys(chosenBreakfastObj)[currentCenterItemIndex];
    chosenLunchObj = chosenBreakfastObj[key];
    chosenLunchName = chosenBreakfastObj[key].info.name;

    addDinnerRecipes()
}

function accept3() {

    let left_arrow = document.getElementById("left_arrow3");
    let right_arrow = document.getElementById("right_arrow3");
    let accept = document.getElementById("accept3");

    left_arrow.disabled = true;
    right_arrow.disabled = true;
    accept.disabled = true;

    
    let key = Object.keys(chosenLunchObj)[currentCenterItemIndex];
    chosenDinnerObj = chosenLunchObj[key];
    chosenDinnerName = chosenLunchObj[key].info.name;

    console.log(chosenBreakfastName);
    console.log(chosenLunchName);
    console.log(chosenDinnerName);
}