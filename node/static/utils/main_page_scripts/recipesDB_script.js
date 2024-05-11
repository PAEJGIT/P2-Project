document.addEventListener("DOMContentLoaded", function () {
    const headerContainer = document.getElementById("header-container");
    headerContainer.innerHTML = Header();
});
document.addEventListener("DOMContentLoaded", function () {
    const headerContainer = document.getElementById("footer-container");
    headerContainer.innerHTML = Footer();
});

// Function to get the API key from the URL
function getApiKeyFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("apikey");
}
const apiKey = getApiKeyFromUrl();
if (!apiKey) {
    console.error("No API key provided.");
} else {
    fetch("/api/recipes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            const recipesList = document.getElementById("recipes-list");
            Object.values(data).forEach((recipe) => {
                const recipeElement = document.createElement("div");
                recipeElement.innerHTML = `<span>${recipe.id}\t${recipe.name}</span>`;
                recipesList.appendChild(recipeElement);
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}