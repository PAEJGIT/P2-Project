// Get current time
const getTime = () => {
	const date = new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	return `${hours}:${minutes}:${seconds}`;
};

const getFilename = (fullPath) => fullPath.split("\\").pop();

/**
 * Color Reference
 * @type {Object}
 */
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

/**
 * Colorize a string with the specified text and background colors.
 * @param {*} textcolor
 * @param {*} backgroundColor
 * @param {*} string
 * @returns {string} The colorized string.
 */
const colorString = (textcolor, backgroundColor, string) => {
	return `${colorsRef[textcolor]}${colorsRef[backgroundColor]}${colorsRef.Bright}${string}${colorsRef.Reset}\t`;
};

/**
 * LogMain function
 * @param {string} fileLocation - Location of the log (default: `__filename`)
 * @param {string} func - Function of the log (default: `null`)
 * @param {string} profix - Profix of the log (default: `'INFO'`)
 * @param {string} message - Message of the log (default: `'MESSAGE'`)
 * @param {string} type - Type of the log (default: `'INFO'`)
 * @param {boolean} time - Show time in log (default: `true`)
 * @param {boolean} space - Add space before log (default: `false`)
 * @param {boolean} enabled - Enable log (default: `true`)
 */
const LogMain = ({
	fileLocation = null,
	currentFunction = null,
	profix = "INFO",
	message = "MESSAGE",
	type = "INFO",
	time = true,
	space = false,
	enabled = true,
}) => {
	const consoleLog = (symbol, fgColor, bgColor) => {
		const timeString = time ? ` ${getTime()}` : "";
		const funcString = currentFunction ? ` | ${currentFunction}` : "";
		const fileString = getFilename(fileLocation);
		const locationString = fileString ? ` in ${fileString}` : "";
		const profixString = profix ? `${profix}: ` : "";

		console.info(colorString(fgColor, bgColor, ` ${symbol}${timeString}${funcString}${locationString} | ${profixString}${message}`));
	};

	const TYPES = {
		DEBUG: ["🛈", "FgWhite", "BgGray"],
		INFO: ["ℹ", "FgWhite", "BgBlue"],
		SUCCESS: ["✔", "FgWhite", "BgGreen"],
		WARN: ["◉", "FgWhite", "BgYellow"],
		ERROR: ["⚠", "FgWhite", "BgRed"],
		TABLE: ["☰", "FgWhite", "BgGray"],
	};

	if (enabled) {
		if (space) console.log("\n");
		consoleLog(...TYPES[type.toUpperCase()]);
	}
};

/**
 * Logging utility functions that dispatch to the main log handler with specific log levels.
 * Each function logs a message with additional details and a predefined log type.
 * @type {Object}
 * @example log.debug(__filename, functionName, 'Debug', 'This is a debug message.', true, true, true);
 * @property {Function} debug - Log a debug message.
 * @property {Function} info - Log an informational message.
 * @property {Function} success - Log a success message.
 * @property {Function} warn - Log a warning message.
 * @property {Function} error - Log an error message.
 * @property {Function} table - Log a table message.
 */
const log = {
	/**
	 * Log Debug function
	 * @param {string} fileLocation - Location of the log (default: `__filename`)
	 * @param {string} currentFunction - Function of the log (default: `null`)
	 * @param {string} profix - Profix of the log (default: `'INFO'`)
	 * @param {string} message - Message of the log (default: `'MESSAGE'`)
	 * @param {string} type - Type of the log (default: `'INFO'`)
	 * @param {boolean} time - Show time in log (default: `false`)
	 * @param {boolean} space - Add space before log (default: `false`)
	 * @param {boolean} enabled - Enable log (default: `true`)
	 * @returns {void}
	 */
	debug: (fileLocation, currentFunction, profix, message, time, space, enabled) => {
		LogMain({ fileLocation, currentFunction, profix, message, time, space, type: "DEBUG", enabled });
	},
	/**
	 * Log Info function
	 * @param {string} fileLocation - Location of the log (default: `__filename`)
	 * @param {string} currentFunction - Function of the log (default: `null`)
	 * @param {string} profix - Profix of the log (default: `'INFO'`)
	 * @param {string} message - Message of the log (default: `'MESSAGE'`)
	 * @param {string} type - Type of the log (default: `'INFO'`)
	 * @param {boolean} time - Show time in log (default: `false`)
	 * @param {boolean} space - Add space before log (default: `false`)
	 * @param {boolean} enabled - Enable log (default: `true`)
	 * @returns {void}
	 */
	info: (fileLocation, currentFunction, profix, message, time, space, enabled) => {
		LogMain({ fileLocation, currentFunction, profix, message, time, space, type: "INFO", enabled });
	},
	/**
	 * Log Success function
	 * @param {string} fileLocation - Location of the log (default: `__filename`)
	 * @param {string} currentFunction - Function of the log (default: `null`)
	 * @param {string} profix - Profix of the log (default: `'INFO'`)
	 * @param {string} message - Message of the log (default: `'MESSAGE'`)
	 * @param {string} type - Type of the log (default: `'INFO'`)
	 * @param {boolean} time - Show time in log (default: `false`)
	 * @param {boolean} space - Add space before log (default: `false`)
	 * @param {boolean} enabled - Enable log (default: `true`)
	 * @returns {void}
	 */
	success: (fileLocation, currentFunction, profix, message, enabled, time, space) => {
		LogMain({ fileLocation, currentFunction, profix, message, time, space, type: "SUCCESS", enabled });
	},
	/**
	 * Log Warning function
	 * @param {string} fileLocation - Location of the log (default: `__filename`)
	 * @param {string} currentFunction - Function of the log (default: `null`)
	 * @param {string} profix - Profix of the log (default: `'INFO'`)
	 * @param {string} message - Message of the log (default: `'MESSAGE'`)
	 * @param {string} type - Type of the log (default: `'INFO'`)
	 * @param {boolean} time - Show time in log (default: `false`)
	 * @param {boolean} space - Add space before log (default: `false`)
	 * @param {boolean} enabled - Enable log (default: `true`)
	 * @returns {void}
	 */
	warn: (fileLocation, currentFunction, profix, message, time, space, enabled) => {
		LogMain({ fileLocation, currentFunction, profix, message, time, space, type: "WARN", enabled });
	},
	/**
	 * Log Error function
	 * @param {string} fileLocation - Location of the log (default: `__filename`)
	 * @param {string} currentFunction - Function of the log (default: `null`)
	 * @param {string} profix - Profix of the log (default: `'INFO'`)
	 * @param {string} message - Message of the log (default: `'MESSAGE'`)
	 * @param {string} type - Type of the log (default: `'INFO'`)
	 * @param {boolean} time - Show time in log (default: `false`)
	 * @param {boolean} space - Add space before log (default: `false`)
	 * @param {boolean} enabled - Enable log (default: `true`)
	 * @returns {void}
	 */
	error: (fileLocation, currentFunction, profix, message, enabled, time, space) => {
		LogMain({ fileLocation, currentFunction, profix, message, time, space, type: "ERROR", enabled });
		//throw new Error(fileLocation, { cause: message });
	},
	/**
	 * Log Table function
	 * @param {string} Object
	 * @returns {void}
	 */
	table: (object) => console.table(object),
};

module.exports = log;
