document.addEventListener("DOMContentLoaded", function () {
    let empty = {};
    reqValidRecipes(empty, (data) => {
        // Call function that runs the choosers
        addBreakfastRecipes(data);
    });
});

function reqValidRecipes(userMacros, callback) {
    fetch("/validRecipes", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({userMacros}),
    })
    .then((response) => response.json())
    .then((data) => {
        callback(data);
        })
    .catch((error) => {
        console.error("Error:", error);
    });
}