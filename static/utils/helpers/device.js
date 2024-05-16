/**
 * Function to get the device type based on the screen width
 * @description Device information
 */
export const getDeviceType = () => {
	const width = Screen.width;
	if (width < 768) {
		return "phone";
	} else if (width >= 768 && width < 1024) {
		return "tablet";
	} else {
		return "desktop";
	}
};
