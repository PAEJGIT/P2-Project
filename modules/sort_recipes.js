const fs = require("fs");
const path = require("path");
const recipesFilePath = path.join(__dirname, "..", "data", "recipes.json");
const sortedRecipesFilePath = path.join(__dirname, "..", "data", "sorted_recipes.json");

function sortRecipes() {
    fs.readFile(recipesFilePath, (err, data) => {

        let recipesJSON = JSON.parse(data);

        let breakfastRecipes = [];
        let lunchRecipes = [];
        let dinnerRecipes = [];

        // Sort the recipes by time
        for(let recipe in recipesJSON) {

            for(let time in recipesJSON[recipe].mealTypes) {
                let recipeTime = "";

                if(time == 0 && recipesJSON[recipe].mealTypes[time]) {
                    breakfastRecipes.push(recipesJSON[recipe].id);
                }

                if(time == 1 && recipesJSON[recipe].mealTypes[time]) {
                    lunchRecipes.push(recipesJSON[recipe].id);
                }

                if(time == 2 && recipesJSON[recipe].mealTypes[time]) {
                    dinnerRecipes.push(recipesJSON[recipe].id);
                }

            }

        }

        // Create JSON file object
        let sortedJSONFileOBJ = {};

        // Create a combination of all recipes
        for(let breakfastRecipe in breakfastRecipes) {
            let breakfastRecipeID = breakfastRecipes[breakfastRecipe];
            let breakfastRecipeName = recipesJSON[breakfastRecipeID].name;

            sortedJSONFileOBJ[breakfastRecipeName] = {"info": {
                "id": breakfastRecipeID,
                "name": breakfastRecipeName,
                "description": recipesJSON[breakfastRecipeID].description,
                "image": recipesJSON[breakfastRecipeID].image,
                "equipment": recipesJSON[breakfastRecipeID].equipment,
                "preparationTime": recipesJSON[breakfastRecipeID].preparationTime,
                "tags": recipesJSON[breakfastRecipeID].tags,
                "categories": recipesJSON[breakfastRecipeID].categories,
                "allergens": recipesJSON[breakfastRecipeID].allergens,
                "ratings": recipesJSON[breakfastRecipeID].ratings,
                "calories": recipesJSON[breakfastRecipeID].macroRatio[0],
                "protein": recipesJSON[breakfastRecipeID].macroRatio[1],
                "carb": recipesJSON[breakfastRecipeID].macroRatio[2],
                "fat": recipesJSON[breakfastRecipeID].macroRatio[3]
            }};

            for(let lunchRecipe in lunchRecipes) {
                let lunchRecipeID = lunchRecipes[lunchRecipe];
                let lunchRecipeName = recipesJSON[lunchRecipeID].name;

                if(breakfastRecipeName === lunchRecipeName) {
                    continue;
                }

                sortedJSONFileOBJ[breakfastRecipeName][lunchRecipeName] = {"info": {
                    "id": lunchRecipeID,
                    "name": lunchRecipeName,
                    "description": recipesJSON[lunchRecipeID].description,
                    "image": recipesJSON[lunchRecipeID].image,
                    "equipment": recipesJSON[lunchRecipeID].equipment,
                    "preparationTime": recipesJSON[lunchRecipeID].preparationTime,
                    "tags": recipesJSON[lunchRecipeID].tags,
                    "categories": recipesJSON[lunchRecipeID].categories,
                    "allergens": recipesJSON[lunchRecipeID].allergens,
                    "calories": recipesJSON[lunchRecipeID].macroRatio[0],
                    "protein": recipesJSON[lunchRecipeID].macroRatio[1],
                    "carb": recipesJSON[lunchRecipeID].macroRatio[2],
                    "fat": recipesJSON[lunchRecipeID].macroRatio[3]
                }};

                for(let dinnerRecipe in dinnerRecipes) {
                    let dinnerRecipeID = dinnerRecipes[dinnerRecipe];
                    let dinnerRecipeName = recipesJSON[dinnerRecipeID].name;

                    if(lunchRecipeName === dinnerRecipeName || breakfastRecipeName === dinnerRecipeName) {
                        continue;
                    }

                    sortedJSONFileOBJ[breakfastRecipeName][lunchRecipeName][dinnerRecipeName] = {"info": {
                        "id": dinnerRecipeID,
                        "name": dinnerRecipeName,
                        "description": recipesJSON[dinnerRecipeID].description,
                        "image": recipesJSON[dinnerRecipeID].image,
                        "equipment": recipesJSON[dinnerRecipeID].equipment,
                        "preparationTime": recipesJSON[dinnerRecipeID].preparationTime,
                        "tags": recipesJSON[dinnerRecipeID].tags,
                        "categories": recipesJSON[dinnerRecipeID].categories,
                        "allergens": recipesJSON[dinnerRecipeID].allergens,
                        "calories": recipesJSON[dinnerRecipeID].macroRatio[0],
                        "protein": recipesJSON[dinnerRecipeID].macroRatio[1],
                        "carb": recipesJSON[dinnerRecipeID].macroRatio[2],
                        "fat": recipesJSON[dinnerRecipeID].macroRatio[3]
                    }};
                }
            }
        }

        let jsonData = JSON.stringify(sortedJSONFileOBJ, null, 4);

        fs.writeFile(sortedRecipesFilePath, jsonData, (err) => {if(err){console.error(err)}});

    });
}

sortRecipes();

