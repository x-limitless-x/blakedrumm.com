$(document).ready(()=> modeSwitcher() )

if ( !localStorage.getItem('color-theme') ){
	document.documentElement.setAttribute('data-theme', 'dark');
	document.documentElement.classList.add("dark-theme");
	localStorage.setItem('color-theme', 'dark');
}
else{
	document.documentElement.classList.add(localStorage.getItem('color-theme') + "-theme");
	document.documentElement.setAttribute('data-theme', localStorage.getItem('color-theme'));
	
}

/**
 * Page theme switching between *light* and *dark*
 * 
 * Initialize page theme and set event handlers
 */
function modeSwitcher() {
	// toggle between light/dark mode for site logo

	switch ( localStorage.getItem('color-theme') ){
		case 'dark':
			$('.theme-toggle').removeAttr('checked');
		break;
		case 'light':
			$('.theme-toggle').attr('checked','');
		break;
	}

    /* 
     * dark-light mode-switcher
     * Change the icons inside the button based on previous settings
     */
    $('.theme-toggle').off('click').on('click', function() {
		let _siteLogo = localStorage.getItem('color-theme') === "light" ? "light" : "dark";
        // if exists and set via local storage previously
		if ($(document.documentElement).attr('data-theme') === "dark" ) {
			document.documentElement.setAttribute('data-theme', 'light');
			localStorage.setItem('color-theme', 'light');
			document.documentElement.classList.remove("dark-theme");
			document.documentElement.classList.add("light-theme");
		} else {
			document.documentElement.setAttribute('data-theme', 'dark');
			localStorage.setItem('color-theme', 'dark');
			document.documentElement.classList.remove("light-theme");
			document.documentElement.classList.add("dark-theme");
		}
		document.getElementsByClassName('top-logo')[0].src = '/assets/img/blake-drumm-logo-'+ _siteLogo + '.png'
    });
}