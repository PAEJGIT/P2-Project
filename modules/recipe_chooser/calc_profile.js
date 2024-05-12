const log = require('./logger.js');
const ENABLE_LOGGING = false;

/**
 * **calculateBMI**
 * Calculates the Body Mass Index (BMI) based on the user's weight and height.
 * @param {number} weight - The weight of the user in kilograms. Must be positive.
 * @param {number} height - The height of the user in centimeters. Must be positive.
 * @returns {number} The calculated BMI value.
 */
const calculateBMI = (weight, height) => {
    if (weight <= 0 || height <= 0) {
        log.error(__filename, calculateBMI.name, 'ERROR', 'Invalid input values for calculating BMI.', ENABLE_LOGGING);
        throw new Error('Invalid input values for calculating BMI.');
    } else {
        const BMI = weight / Math.pow(height / 100, 2);
        log.success(__filename, calculateBMI.name, 'Calculating BMI was successful', BMI, ENABLE_LOGGING);
        return BMI;
    }
};
/**
 * **calculateBMR**
 *
 * Calculates the Basal Metabolic Rate (BMR) using the Harris-Benedict Equation.
 * @param {string} sex - The sex of the user ('male' or 'female'). Must be 'male' or 'female'.
 * @param {number} age - The age of the user in years. Must be a positive integer.
 * @param {number} weight - The weight of the user in kilograms. Must be positive.
 * @param {number} height - The height of the user in centimeters. Must be positive.
 * @returns {number} The calculated BMR value.
 * @throws {Error} If any input is not valid.
 */
const calculateBMR = (sex, age, weight, height) => {
    if (!['male', 'female'].includes(sex) || age <= 0 || weight <= 0 || height <= 0) {
        log.error(__filename, calculateBMR.name, 'ERROR', 'Invalid input values for calculating BMR.', ENABLE_LOGGING);
        throw new Error('Invalid input values for calculating BMR.');
    } else {
        const BMR =
            sex === 'male'
                ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
                : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
        log.success(__filename, calculateBMR.name, 'Calculating BMR was successful', BMR, ENABLE_LOGGING);
        return BMR;
    }
};
/**
 * Calculate the Total Daily Energy Expenditure (TDEE) based on the user's BMR and activity factor.
 * @param {number} BMR - The Basal Metabolic Rate of the user.
 * @param {number} activityFactor - The activity factor of the user.
 * @returns {number} The calculated TDEE value.
 */
const calculateTDEE = (BMR, activityFactor) => {
    let TDEE = 0;
    if (activityFactor < 1 && activityFactor > 5) {
        log.error(
            __filename,
            calculateTDEE.name,
            'ERROR',
            "Invalid input values for 'activityFactor' in calculating TDEE.",
            ENABLE_LOGGING
        );
        throw new Error('Invalid input values for calculating TDEE.', {
            cause: "Invalid input for 'activityFactor'",
        });
    } else {
        switch (activityFactor) {
            case 1:
                TDEE += BMR * 1.2;
                break;
            case 2:
                TDEE += BMR * 1.375;
                break;
            case 3:
                TDEE += BMR * 1.55;
                break;
            case 4:
                TDEE += BMR * 1.725;
                break;
            case 5:
                TDEE += BMR * 1.9;
                break;
        }
        log.success(__filename, calculateTDEE.name, 'Calculating TDEE was successful', TDEE, ENABLE_LOGGING);
        return TDEE;
    }
};
/**
 * Calculate the adjusted Total Daily Energy Expenditure (TDEE) based on the user's health goal.
 * @param {number} TDEE - The Total Daily Energy Expenditure of the user.
 * @param {string} compositionGoal - The health goal of the user ('maintenance', 'musclegain', 'fatloss', 'weightloss', 'weightgain').
 * @returns {number} The adjusted TDEE value.
 * @throws {Error} If the TDEE or health goal is invalid.
 */
const calculateAdjustedTDEE = (TDEE, compositionGoal) => {
    const modifiers = {
        maintenance: 0,
        musclegain: 300,
        fatloss: -300,
        weightloss: -500,
        weightgain: 500,
    };
    const roundToNearest = (numberToRound, toNearestNumber) =>
        Math.round(numberToRound / toNearestNumber) * toNearestNumber;
    if (TDEE <= 0) {
        log.error(__filename, calculateAdjustedTDEE.name, 'ERROR', 'Invalid TDEE value', ENABLE_LOGGING);
        throw new Error('Invalid TDEE value');
    } else if (!['maintenance', 'musclegain', 'fatloss', 'weightloss', 'weightgain'].includes(compositionGoal)) {
        log.error(__filename, calculateAdjustedTDEE.name, 'ERROR', 'Invalid health goal', ENABLE_LOGGING);
        throw new Error('Invalid health goal');
    } else {
        log.success(
            __filename,
            calculateAdjustedTDEE.name,
            'Calculating adjusted TDEE was successful',
            TDEE + modifiers[compositionGoal],
            ENABLE_LOGGING
        );
        return roundToNearest(TDEE + modifiers[compositionGoal], 50);
    }
};
/**
 * Calculates the protein requirements for a user based on their demographic and dietary details.
 *
 * @param {string} sex - The sex of the user, either 'male' or 'female'.
 * @param {number} age - The age of the user in years.
 * @param {number} weight - The weight of the user in kilograms.
 * @param {number} activityFactor - A numeric scale indicating activity level, where 4 or greater represents high activity.
 * @param {boolean} pregnant - Indicates if the user is pregnant.
 * @param {boolean} lactating - Indicates if the user is lactating.
 * @param {string} compositionGoal - The user's fitness goal, such as 'maintenance', 'musclegain', 'fatloss', 'weightloss', or 'weightgain'.
 * @param {string} compositionPreference - Dietary preference of the user, such as 'vegan', 'vegetarian', etc.
 * @returns {number} The calculated protein requirement in grams.
 */
const calculateProteins = (
    sex,
    age,
    weight,
    activityFactor,
    pregnant,
    lactating,
    compositionGoal,
    compositionPreference
) => {
    const ageGroup = age > 60 ? 'over60' : 'under60';
    const activityLevel = activityFactor >= 4 ? 'high' : 'low';

    const multipliers = {
        maintenance: {
            over60: {
                male: { high: 1.3, low: 1.2 },
                female: { high: 1.2, low: 1.1 },
            },
            under60: {
                male: { high: 1.2, low: 1.1 },
                female: { high: 1.1, low: 1.0 },
            },
        },
        musclegain: {
            over60: {
                male: { high: 2.0, low: 1.9 },
                female: { high: 1.9, low: 1.8 },
            },
            under60: {
                male: { high: 1.9, low: 1.8 },
                female: { high: 1.8, low: 1.7 },
            },
        },
        fatloss: {
            over60: {
                male: { high: 1.7, low: 1.6 },
                female: { high: 1.6, low: 1.5 },
            },
            under60: {
                male: { high: 1.6, low: 1.5 },
                female: { high: 1.5, low: 1.4 },
            },
        },
        weightloss: {
            over60: {
                male: { high: 1.5, low: 1.4 },
                female: { high: 1.4, low: 1.3 },
            },
            under60: {
                male: { high: 1.4, low: 1.3 },
                female: { high: 1.3, low: 1.2 },
            },
        },
        weightgain: {
            over60: {
                male: { high: 1.4, low: 1.3 },
                female: { high: 1.3, low: 1.2 },
            },
            under60: {
                male: { high: 1.4, low: 1.2 },
                female: { high: 1.3, low: 1.1 },
            },
        },
    };
    const multiplier =
        multipliers[compositionGoal][ageGroup][sex][activityLevel] +
            (pregnant ? 0.8 : lactating ? 0.4 : 0) +
            (compositionPreference === 'vegan' ? 0.2 : 0) +
            (compositionPreference == 'vegetarian' ? 0.1 : 0) || 1; // Default
    return Math.round(weight * multiplier);
};
/**
 * Calculates the estimated carbohydrate needs based on the remaining calories and health goal.
 * @param {object} data - The data object containing the user's data.
 * @param {number} options.remainingCalories - The remaining calories after accounting for proteins and carbohydrates.
 * @param {number} options.age - The age of the user in years.
 * @param {number} options.activityFactor - The activity factor of the user.
 * @param {boolean} options.pregnant - Whether the user is pregnant.
 * @param {string} options.compositionGoal - The health goal of the user ('maintenance', 'musclegain', 'fatloss', 'weightloss', 'weightgain').
 * @param {string} options.compositionPreference - The dietary preference of the user ('omnivore', 'vegetarian', 'vegan', 'balanced').
 * @param {string} options.compositionType - The dietary type of the user ('keto', 'low-carb', 'high-fiber', 'balanced').
 * @returns {number} The estimated carbohydrate intake in grams.
 */
const calculateCarbs = ({
    remainingCalories,
    age,
    activityFactor,
    pregnant,
    compositionGoal,
    compositionPreference,
    compositionType,
}) => {
    const ageGroup = age > 60 ? 'over60' : 'under60';
    const activityLevel = activityFactor >= 4 ? 'high' : 'low';
    // Define base ratios for carbohydrate intake based on health goal
    const baseRatios = {
        maintenance: 0.5,
        musclegain: 0.6,
        fatloss: 0.3,
        weightloss: 0.4,
        weightgain: 0.7,
    };
    let carbRatio =
        (compositionPreference === 'omnivore' ? 0.3 : baseRatios[compositionGoal]) || baseRatios['maintenance'];
    const modifiers = {
        'over60': ageGroup === 'over60' ? 0.05 : -0.05,
        'pregnant': pregnant ? 0.1 : 0,
        'low-carb': compositionType === 'low-carb' ? -baseRatios[compositionGoal] + 0.25 : 0,
        'keto': compositionType === 'keto' ? -carbRatio + (0.1 - activityFactor / 1000) : 0,
        'highActivity': activityLevel === 'high' ? 0.1 : 0,
    };
    // Apply modifiers if conditions are true
    for (const modifier in modifiers) {
        carbRatio += modifiers[modifier];
    }
    return Math.round((remainingCalories * carbRatio) / 4);
};
/**
 * Calculates the estimated daily fiber needs based on age, sex, and caloric intake.
 * @param {string} sex - The sex of the person ('male' or 'female').
 * @param {number} age - The age of the person in years.
 * @param {number} TDEE - Total daily caloric intake.
 * @returns {number} The estimated fiber intake in grams.
 */
const calculateFibers = (estimatedCarbs, TDEE) => {
    const baseFiber = (TDEE / 1000) * 14; // General recommendation: 14g of fiber per 1000 calories
    if (baseFiber > estimatedCarbs) {
        // ~Around 2/3 of the fiber is soluble and 1/3 is insoluble
        return Math.round(estimatedCarbs / 3);
    }
    return Math.round(baseFiber);
};
/**
 * Calculates the user's nutritional profile based on their basic information.
 * @param {UserProfile} userProfile - The user's profile data containing personal and dietary information: {`sex`, `weightKg`, `heightCm`, `age`, `activityFactor`, `pregnant`, `compositionGoal`, `compositionPreference`, `compositionType`}
 * @returns {object} The user's calculated nutritional profile including macronutrients and caloric needs.
 */
const calculateUserProfile = (userProfile) => {
    const {
        sex,
        weightKg,
        heightCm,
        age,
        activityFactor,
        pregnant,
        lactating,
        compositionGoal,
        compositionPreference,
        compositionType,
    } = userProfile;
    // Calculate BMI
    const BMI = calculateBMI(weightKg, heightCm);
    // Calculate Basal Metabolic Rate (BMR)
    const BMR = calculateBMR(sex, age, weightKg, heightCm);
    // Calculate Total Daily Energy Expenditure (TDEE)
    const TDEE = calculateTDEE(BMR, activityFactor);
    // Adjust TDEE based on composition goal (e.g., weight loss, gain, or maintenance)
    const adjustedTDEE = calculateAdjustedTDEE(TDEE, compositionGoal);
    // Calculate protein requirements and their caloric contribution
    const proteins = calculateProteins(
        sex,
        age,
        weightKg,
        activityFactor,
        pregnant,
        lactating,
        compositionGoal,
        compositionPreference
    );
    const proteinCalories = proteins * 4;
    // Calculate remaining calories for carbs after accounting for protein calories
    let remainingCalories = adjustedTDEE - proteinCalories;
    // Calculate carbohydrate requirements and their caloric contribution
    const carbs = calculateCarbs({
        remainingCalories,
        age,
        activityFactor,
        pregnant,
        compositionGoal,
        compositionPreference,
        compositionType,
    });
    const carbCalories = carbs * 4;
    const fibers = calculateFibers(carbs, adjustedTDEE);
    // Calculate remaining calories for fats
    remainingCalories = adjustedTDEE - proteinCalories - carbCalories;
    // Assuming fats provide 9 calories per gram, calculate fat requirements
    const fats = Math.round(remainingCalories / 9);

    // Assemble and return the user profile with calculated nutritional data
    return {
        BMI: BMI,
        BMR: BMR,
        TDEE: TDEE,
        adjustedTDEE: adjustedTDEE,
        protein: proteins,
        carb: carbs,
        fibers: fibers,
        fat: fats,
        calories: proteins * 4 + carbs * 4 + fats * 9,
    };
};

module.exports = calculateUserProfile;

const data = {
    userProfile: {
        basicInfo: {
            name: 'John Doe',
            sex: 'male',
            weightKg: 80,
            heightCm: 180,
            age: 30,
            activityFactor: 2, // (1.2, 1.375, 1.55, 1.725, 1.9)
            pregnant: false,
            lactating: false,
            compositionGoal: 'maintenance', // ('maintenance', 'musclegain', 'fatloss', 'weightloss', 'weightgain')
            compositionPreference: 'balanced', // ('omnivore', 'vegetarian', 'vegan', 'balanced')
            compositionType: 'balanced', // ('keto', 'low-carb', 'high-fiber', 'balanced')
        },
        dietaryPreferences: {
            excludeIngredients: ['milk', 'eggs'],
            excludeRecipes: ['recipe1', 'recipe2'],
            favoriteCuisines: ['italian', 'mexican'],
            maxCookingTimeMinutes: 30,
            preferredCookingEquipment: ['oven', 'stove'],
            cookingDifficultyLevel: 1,
            servingSize: 2,
        },
        nutritionalTargets: {
            totalDailyEnergyExpenditure: 0,
            proteinGrams: 0,
            carbohydratesGrams: 0,
            fatGrams: 0,
            fiberGrams: 0,
            bodyMassIndex: 0,
        },
    },
};

/*
const generateRandomUser = () => {
    const names = ['Daniel Doe', 'Stefan Doe', 'Johannes Doe', 'Peter Doe'];
    const sexes = ['male', 'female'];
    const goals = ['maintenance', 'musclegain', 'fatloss', 'weightloss', 'weightgain'];
    const preferences = ['omnivore', 'vegetarian', 'vegan', 'balanced'];
    const types = ['keto', 'low-carb', 'high-fiber', 'balanced'];
    const activityFactors = [1, 2, 3, 4, 5];
    return {
        name: names[Math.floor(Math.random() * names.length)],
        sex: sexes[Math.floor(Math.random() * sexes.length)],
        weightKg: Math.round(Math.random() * 50 + 100),
        heightCm: Math.round(Math.random() * 70 + 150),
        age: Math.round(Math.random() * 84 + 16),
        activityFactor: activityFactors[Math.floor(Math.random() * activityFactors.length)],
        pregnant: Math.random() < 0.5 ? false : true,
        lactating: Math.random() < 0.5 ? false : true,
        compositionGoal: goals[Math.floor(Math.random() * goals.length)],
        compositionPreference: preferences[Math.floor(Math.random() * preferences.length)],
        compositionType: types[Math.floor(Math.random() * types.length)],
    };
};

console.log(generateRandomUser());
*/
// log.table(
//     calculateUserProfile({
//         name: 'John Doe',
//         sex: 'male',
//         weightKg: 100,
//         heightCm: 180,
//         age: 30,
//         activityFactor: 2, // (1.2, 1.375, 1.55, 1.725, 1.9)
//         pregnant: false,
//         lactating: false,
//         compositionGoal: 'maintenance', // ('maintenance', 'musclegain', 'fatloss', 'weightloss', 'weightgain')
//         compositionPreference: 'balanced', // ('omnivore', 'vegetarian', 'vegan', 'balanced')
//         compositionType: 'balanced', // ('keto', 'low-carb', 'high-fiber', 'balanced')
//     })
// );
