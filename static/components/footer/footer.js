/**
 * Footer component
 * @param {string} cssPath - Path to the CSS file
 * @returns {string} - HTML string
 */
const Footer = (cssPath = 'components/footer/footer.css') => {
	// Load the CSS file
	const loadCSS = () => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = cssPath; // Adjust the path as necessary
		document.head.appendChild(link);
	};
	// HTML string
	const footerHTML = `
    <footer>
        <div id="footer-container-left">
            <a href="/node2/"><img id="logo" src="assets/images/logo.png"></a>
            <span id="footer-container-left-content"> © 2023-current — Aalborg Universitet. All rights reserved.</span>
        </div>
        <div id="footer-container-right">

        	    <a href="#" class="footer-container-right-links">Privacy Policy</a>
        	    <a href="#" class="footer-container-right-links">Terms & Conditions</a>
        	    <a href="#" class="footer-container-right-links">Cookie Policy</a>
        	    <a href="#" class="footer-container-right-links">Contact</a>

        </div>
    </footer>
    `;
	// Inject the HTML string into the DOM
	document.addEventListener('DOMContentLoaded', function () {
		const footerContainer = document.getElementById('footer-container');
		if (footerContainer) {
			footerContainer.innerHTML = footerHTML;
			loadCSS();
		} else {
			console.error('Footer container not found');
		}
	});
	// Return the HTML string
	return footerHTML;
};

Footer();
