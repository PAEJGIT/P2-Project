const Header = () => {
	return `
        <div id="header">
        <a href="/"><img id="logo" src="../assets/images/logo.png"></a>

        <nav class="nav_bar">
            <ul>
                <li>
                    <img class="nav_icons" src="https://static-00.iconduck.com/assets.00/full-screen-icon-256x256-z03tmnai.png" />
                    <a class="endpoints" href="/recipes">Recipe Database</a>
                </li>
                <li>
                    <img class="nav_icons" src="https://static-00.iconduck.com/assets.00/full-screen-icon-256x256-z03tmnai.png" />
                    <a class="endpoints" href="/ingredients">Ingredient Database</a>
                </li>
                <li>
                    <img class="nav_icons" src="https://static-00.iconduck.com/assets.00/full-screen-icon-256x256-z03tmnai.png" />
                    <a class="endpoints" id="kosttilskud" href="#">Supplement Database</a>
                </li>
            </ul>
        </nav>

        <div id="nav_buttons">
            <button id="log_in_button" onclick="location.href='https://google.com'" type="button">Log ind</button>
            <button id="sign_in_button" onclick="location.href='https://google.com'" type="button">Opret bruger</button>
        </div>
    </div>
    `;
};
