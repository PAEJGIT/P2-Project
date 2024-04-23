// Booleans
export const isBool = (value) => typeof value === "boolean";
export const isUndefined = (value) => typeof value === "undefined";
export const isNumber = (value) => typeof value === "number";
export const isInt = (value) => Number.isInteger(value);
export const isNaN = (value) => Number.isNaN(value);
export const isArray = (arr) => Array.isArray(arr);
export const isObject = (object) => typeof object === "object";
export const isString = (str) => typeof str === "string";
export const isEmptyString = (str) => str === "";
export const isNotEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;

// Numbers
export const round = (value) => Math.round(value);
export const isEven = (val) => val % 2 === 0;

// String
export const capitalizeAll = (str) => str.toUpperCase();
export const capitalizeFirst = (str) =>
	str && str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;
export const capitalizeAllStartingWords = (str, lower = false) =>
	(lower ? str.toLowerCase() : str).replace(/(?:^|\s|[''({])+\S/g, (match) =>
		match.toUpperCase()
	);
export const extractStringAndNumbers = (str) => {
	return {
		string: str.replace(/[0-9]/g, ""),
		numbers: toNumber(str.replace(/\D/g, "")),
	};
};
export const extractNumbers = (str) => str.replace(/[^0-9]/gi, "");
export const getRandomColor = () => {
	const colors = [
		"gray",
		"red",
		"pink",
		"grape",
		"violet",
		"indigo",
		"blue",
		"cyan",
		"teal",
		"green",
		"lime",
		"yellow",
		"orange",
	];
	return colors[Math.floor(Math.random() * colors.length)];
};

// Object
export const getKeys = (obj) => Object.keys(obj);
export const getValues = (obj) => Object.values(obj);

// Array
export const mergeArrays = (a, b) => [...a, ...b];
export const getUnion = (...arr) => [...new Set(arr.flat())];
export const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());
export const getMinMaxOfArray = (arr) => [Math.min(...arr), Math.max(...arr)];
export const removeAllDuplicateValuesInArray = (arr) => [...new Set(arr)];
export const reverseArray = (arr) => arr.reverse();
export const findIndexFromValues = (arr, itemToFind) =>
	Object.values(arr).findIndex((item) => item === itemToFind);
export const mergeArraysAndRemoveDuplicates = (a, b) => [...new Set([...a, ...b])];

// Random
export const randomBoolean = () => Math.random() >= 0.5;
export const randomString = () => Math.random().toString(36).slice(2);
export const randomNumber = (min = 1, max = 100) =>
	Math.floor(Math.random() * (max - min + 1) + min);
export const randomHexColor = () =>
	`#${Math.floor(Math.random() * 0xffffff)
		.toString(16)
		.padEnd(6, "0")}`;

// Conversion
export const toNumber = (value) => Number(value);
export const toFloat = (value) => parseFloat(value);
export const toObj = (arr) => Object.fromEntries(arr);
export const RGBToHexColor = (r, g, b) =>
	"#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
export const varToString = (varObj) => Object.keys(varObj)[0];
export const hexToRGB = (hex, opacity = "1") => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return [r, g, b, opacity];
};
export const toJson = (obj) => JSON.stringify(obj);

// Math
export const getPercentage = (number, percentage) => (number / 100) * percentage;
export const getPercentageOfTwoNumbers = (a, b) => (a / b) * 100;
export const intervalBetweenTwoNumbers = (a, b) => Math.abs(a - b);
export const getAverageBetweenNumbers = (arr) => {
	const sum = arr.reduce((a, b) => a + b);
	return sum / arr.length;
};
