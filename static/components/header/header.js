/**
 * Header component
 * @param {string} cssPath - Path to the CSS file
 * @returns {string} - HTML string
 */
const Header = (cssPath = '../components/header/header.css', injectTo = 'header-container') => {
	// State to check if the user is logged in
	let username = localStorage.getItem('username') ? true : false;
	// Event listener for the log out button
	document.addEventListener('click', (e) => {
		// Clear local storage
		if (e.target.id === 'log_out_button') {
			localStorage.clear();
			window.location.href = '/';
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
            <a href="/"><img id="logo" src="../assets/images/logo.png"></a>
            <nav class="nav_bar">
                <ul id="nav_bar_list_container">
                    <li>
                        <img class="nav_icons" src="../assets/icons/icon_soup.svg" />
                        <a class="endpoints" href="/recipes">Recipe Database</a>
                    </li>
                    <li>
                        <img class="nav_icons" src="../assets/icons/icon_cherry.svg" />
                        <a class="endpoints" href="/ingredients">Ingredient Database</a>
                    </li>
                </ul>
            </nav>
            <div id="nav_buttons">
                         ${
								username
									? `
			<div class="button_nav">
            	<button id="button_navigation" class="log-out-button" type="button">
					<img src="../../assets/icons/icon_logout.svg"></img>
				</button>
				<button id="button_navigation" class="settings-button"  type="button">
					<img src="../../assets/icons/icon_settings.svg"></img>
				</button>
				<button id="avatar" class="avatar-button"  type="button">
					<img src="../../assets/icons/icon_user.svg"></img>
				</button>
			</div>

			<div class="logged_in_text">
				<div id="user_name">Logged in as: ${localStorage.getItem('username')}</div>
			</div>
            `
									: `
            <button id="log_in_button" onclick="location.href='/login'" type="button">Log in</button>
            <button id="sign_in_button" onclick="location.href='/register'" type="button">Sign up</button>
            `
							}
            </div>

    </div>
    `;

	// Inject the HTML string into the DOM
	document.addEventListener('DOMContentLoaded', function () {
		const headerContainer = document.getElementById(injectTo);
		if (headerContainer) {
			headerContainer.innerHTML = headerHTML;
			loadCSS();
		} else {
			console.error('Header container not found');
		}
	});
	// Return the HTML string
	return headerHTML;
};

// Call the Header function
Header();
