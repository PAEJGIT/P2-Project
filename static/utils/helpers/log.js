// Get current time
export const getTime = () => {
	const date = new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	return `${hours}:${minutes}:${seconds}`;
};
// Get current date
export const getDate = () => {
	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	return `${day}.${month}.${year}`;
};

// Colorcodes
const colorsRef = {
	Reset: "\x1b[0m",
	Bright: "\x1b[1m",
	Dim: "\x1b[2m",
	Underscore: "\x1b[4m",
	Blink: "\x1b[5m",
	Reverse: "\x1b[7m",
	Hidden: "\x1b[8m",

	FgBlack: "\x1b[30m",
	FgRed: "\x1b[31m",
	FgGreen: "\x1b[32m",
	FgYellow: "\x1b[33m",
	FgBlue: "\x1b[34m",
	FgMagenta: "\x1b[35m",
	FgCyan: "\x1b[36m",
	FgWhite: "\x1b[37m",
	FgGray: "\x1b[90m",

	BgBlack: "\x1b[40m",
	BgRed: "\x1b[41m",
	BgGreen: "\x1b[42m",
	BgYellow: "\x1b[43m",
	BgBlue: "\x1b[44m",
	BgMagenta: "\x1b[45m",
	BgCyan: "\x1b[46m",
	BgWhite: "\x1b[47m",
	BgGray: "\x1b[100m",
};
// Color Function
const colorString = (textcolor, backgroundColor, string) => {
	return `${colorsRef[textcolor]}${colorsRef[backgroundColor]}${colorsRef.Bright}${string}${colorsRef.Reset}`;
};

// Log function
export const LogMain = ({
	location = null,
	func = null,
	profix = null,
	message = "MESSAGE",
	type = "INFO",
	time = false,
	space = false,
	enabled = true,
}) => {
	const consoleLog = (symbol, fgColor, bgColor) =>
		console.info(
			colorString(
				fgColor,
				bgColor,
				` ${symbol}${time ? " " + getTime() : ""}${func ? " | " + func : ``}${
					location && func ? " at " : ""
				}${location ? "" + location : ""} | ${profix ? profix + ": " : ""}${message} `
			)
		);
	const TYPES = {
		DEBUG: ["🛈", "FgWhite", "BgGray"],
		INFO: ["ℹ", "FgWhite", "BgBlue"],
		SUCCESS: ["✔", "FgWhite", "BgGreen"],
		WARN: ["◉", "FgWhite", "BgYellow"],
		ERROR: ["⚠", "FgWhite", "BgRed"],
		TABLE: ["☰", "FgWhite", "BgGray"],
	};
	return (
		enabled &&
		(space && console.log("\n"),
		type.toUpperCase() === "COUNTER"
			? consoleCounter()
			: consoleLog(...TYPES[type.toUpperCase()]))
	);
};

/**
 * ### Log function
 *
 * ---
 *
 * @param {string} location - Location of the log
 * @param {string} func - Function of the log
 * @param {string} profix - Profix of the log
 * @param {string} message - Message of the log
 * @param {string} type - Type of the log
 * @param {boolean} time - Show time in log
 * @param {boolean} space - Add space before log
 * @returns {function}
 */
export const log = {
	debug: (location, func, profix, message, time, space, enabled) =>
		LogMain({ location, func, profix, message, time, space, type: "DEBUG", enabled }),
	info: (location, func, profix, message, time, space, enabled) =>
		LogMain({ location, func, profix, message, time, space, type: "INFO", enabled }),
	success: (location, func, profix, message, time, space, enabled) =>
		LogMain({ location, func, profix, message, time, space, type: "SUCCESS", enabled }),
	warn: (location, func, profix, message, time, space, enabled) =>
		LogMain({ location, func, profix, message, time, space, type: "WARN", enabled }),
	error: (location, func, profix, message, time, space, enabled) =>
		LogMain({ location, func, profix, message, time, space, type: "ERROR", enabled }),
	table: (location, func, profix, message, time, space, enabled) =>
		LogMain({ location, func, profix, message, time, space, type: "TABLE", enabled }),
};

window.log = log;
