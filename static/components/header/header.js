/**
 * Header component
 * @param {string} cssPath - Path to the CSS file
 * @returns {string} - HTML string
 */
const Header = (cssPath = 'components/header/header.css', injectTo = 'header-container') => {
	// State to check if the user is logged in
	let username = localStorage.getItem('username') ? true : false;
	// Event listener for the log out button
	document.addEventListener('click', (e) => {
		// Clear local storage
		if (e.target.id === 'log_out_button') {
			localStorage.clear();
			window.location.href = '/node2/';
		}
	});
	// Event listener for the log in button

	// Load the CSS file
	const loadCSS = () => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = cssPath;
		document.head.appendChild(link);
	};
	// HTML string
	const headerHTML = `
    <div id="header">
            <a href="/node2/"><img id="logo" src="assets/images/logo.png"></a>
            <nav class="nav_bar">
                <ul id="nav_bar_list_container">
                    <li>
                        <img class="nav_icons" src="assets/icons/icon_soup.svg" />
                        <a class="endpoints" href="/node2/">Recipe Database</a>
                    </li>
                    <li>
                        <img class="nav_icons" src="assets/icons/icon_cherry.svg" />
                        <a class="endpoints" href="/node2/">Ingredient Database</a>
                    </li>
                </ul>
            </nav>
            <div id="nav_buttons">
                         ${
								username
									? `
			<div class="button_nav">
            	<button id="log_out_button" class="log-out-button" type="button">
					<img class="log-out-button-icon" src="assets/icons/icon_logout.svg"></img>
				</button>
				<button id="button_navigation" class="settings-button"  type="button">
					<img src="assets/icons/icon_settings.svg"></img>
				</button>
				<button id="avatar" class="avatar-button"  type="button">
					<img src="assets/icons/icon_user.svg"></img>
				</button>
			</div>

			<div class="logged_in_text">
				<div id="user_name">Logged in as: ${localStorage.getItem('username')}</div>
			</div>
            `
									: `
            <button id="button-header-login" class="button filled btnLogin-popup"  type="button">Log in</button>
            <button id="button-header-signin" class="button outline btnLogin-popup"  type="button">Sign up</button>
            `
							}
            </div>
    </div>
    `;

	// Inject the HTML string into the DOM
	document.addEventListener('DOMContentLoaded', function () {
		const wrapper = document.querySelector('.wrapper');
		const headerContainer = document.getElementById(injectTo);
		if (headerContainer) {
			headerContainer.innerHTML = headerHTML;
			loadCSS();
			if (!username) {
				document.getElementById('button-header-login').addEventListener('click', function () {
					document.getElementById('overlay').classList.add('active');
					wrapper.classList.remove('active');
				});
				document.getElementById('button-header-signin').addEventListener('click', function () {
					document.getElementById('overlay').classList.add('active');
					wrapper.classList.add('active');
				});
				document.getElementById('button-header-login').addEventListener('click', () => {
					wrapper.classList.add('active-popup');
				});
				document.getElementById('button-header-signin').addEventListener('click', () => {
					wrapper.classList.add('active-popup');
				});
			}
		} else {
			console.error('Header container not found');
		}
	});
	// Return the HTML string
	return headerHTML;
};

// Call the Header function
Header();
