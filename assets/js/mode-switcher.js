$(document).ready(()=> modeSwitcher() )

function getColorTheme() {
	return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function setColorTheme(theme) {
	var isLight = theme === 'light';
	document.documentElement.setAttribute('data-theme', theme);
	document.documentElement.classList.toggle('light-theme', isLight);
	document.documentElement.classList.toggle('dark-theme', !isLight);

	try {
		localStorage.setItem('color-theme', theme);
	} catch (error) {}

	$('.theme-toggle').prop('checked', isLight);

	var logo = document.getElementsByClassName('top-logo')[0];
	if (logo) {
		logo.src = '/assets/img/blake-drumm-logo-' + (isLight ? 'dark' : 'light') + '.png';
	}
}

/**
 * Page theme switching between *light* and *dark*
 * 
 * Initialize page theme and set event handlers
 */
function modeSwitcher() {
	setColorTheme(getColorTheme());

    /* 
     * dark-light mode-switcher
     * Change the icons inside the button based on previous settings
     */
    $('.theme-toggle').off('click').on('click', function() {
		setColorTheme(getColorTheme() === 'dark' ? 'light' : 'dark');
    });
}