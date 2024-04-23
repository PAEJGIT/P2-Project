/**
 *
 * @param {*} param0
 */
export const Spacer = (mx = "1px", my = "10px", targetSelector = "body") => {
	// Create a new div element
	const spacer = document.createElement("div");
	spacer.id = "spacer"; // Set the ID to "spacer"
	spacer.style.zIndex = 0;
	spacer.style.width = mx;
	spacer.style.height = my;

	// Get the target element
	const targetElement = document.querySelector(targetSelector);
	if (targetElement) {
		// Append the spacer element to the target element
		targetElement.appendChild(spacer);
	} else {
		console.error(`Spacer: Unable to find target element '${targetSelector}'.`);
	}
};
