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
// Get the API key from the input field
function getApiKey() {
    const apiKeyInput = document.getElementById("API_key");
    return apiKeyInput.value;
}
const apiKey = getApiKeyFromUrl();
// Check if the API key is valid on button click
document.querySelector("button").addEventListener("click", function () {
    // Add a loading indicator modal with ID "loading" to the page
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "loading-overlay";
    const loadingModal = document.createElement("div");
    loadingModal.id = "loading";
    loadingModal.innerHTML = "Loading...";
    document.body.appendChild(loadingOverlay);
    loadingOverlay.appendChild(loadingModal);

    // Wait 4 seconds to simulate a loading process
    setTimeout(function () {
        // Remove the loading indicator modal
        document.body.removeChild(loadingOverlay);

        // Check if the API key is valid
        const apiKey = getApiKey();
        if (!apiKey) {
            console.error("No API key provided.");
        } else {
            fetch("/api/ingredients", {
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
                    const ingredientsList = document.getElementById("ingredients-list");
                    Object.values(data).forEach((ingredient) => {
                        const ingredientElement = document.createElement("div");
                        ingredientElement.innerHTML = `<span>${ingredient.FoodID}\t${ingredient.FoodName}</a>`;
                        ingredientsList.appendChild(ingredientElement);
                    });
                })
                .catch((error) => console.error("Error fetching data:", error));
        }
    }, 2500);
});