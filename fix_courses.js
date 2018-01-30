actual_courses = []

hide_courses = false;

// Get URLs for resources
const wallpaperURL = chrome.extension.getURL('wallpaper.jpg');
const spinnerURL   = chrome.extension.getURL('spinner.png');
const logoURL      = chrome.extension.getURL('logo.png');

// default color values
sidebar_color = '#697854';
sidebar_shadow_color = '#697854';
sidebar_clicked_color = '#8ba26a';
loading_color = '#8ba26a';

$(document).ready(function() {
	chrome.storage.sync.get({
		hideCourses: true,
		themeColor: "#697854",
		courseList: []
	}, function(items) {
		hide_courses = items.hideCourses;
		setColor(items.themeColor);
		actual_courses = items.courseList;
		addKewlCss();
	});

	chrome.storage.onChanged.addListener(function(changes) {
		for(key in changes)
		{
			if(key == "hideCourses")
			{
				hide_courses = changes[key].newValue;
				fixCourses();
			}
			else if(key == "themeColor")
			{
				themeColor = changes[key].newValue;
				setColor(themeColor);

			}
			else if(key == "courseList")
			{
				actual_courses = changes[key].newValue;

			}

		}
	});
});

function addKewlCss()
{
	// Add custom styling to head
	$('head').append(`
	<style>
	.base-profile .profile-content .user-information section ul .data-row .data-container .data-value.spinner:after, .base-profile .profile-content .user-settings section ul .data-row .data-container .data-value.spinner:after {
			display: none;
	}

	#initial-load-area {
			background-color: ${loading_color} !important;
	}

	.base #side-menu .bb-inner-wrap>header {
		background-color: ${sidebar_color} !important;
		border-bottom: 2px solid ${sidebar_shadow_color} !important;
		box-shadow: 0 3px 0 0 ${sidebar_shadow_color} !important;
	}

	.base #side-menu {
		background-color: ${sidebar_color} !important;
	}

	.base #side-menu .off-canvas-list>li.active a {
		background-color: ${sidebar_clicked_color} !important;
	}

	.base #side-menu .off-canvas-list>li a:hover {
		background-color: ${sidebar_clicked_color} !important;
	}

	body {
		background-image: url('${wallpaperURL}');
	}

	.spinner {
			left: -50px;
			up: -50px;
	}

	.spinner:after {
			width: 100px !important;
			height: 100px !important;
			background: url('${spinnerURL}') !important;
			background-size: cover !important;
			content: '' !important;
			border: none !important;
			animation: spinX 3s linear infinite !important;
	}

	@keyframes spinX {
		0% {
			transform: translate(-50px, -50px) rotateZ(0deg);
			transform-origin: 50% 50% 0;
		}
		100% {
			transform: translate(-50px, -50px) rotateZ(360deg);
			transform-origin: 50% 50% 0;
		}
	}
	</style>
	`);
}

//https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function setColor(themeColor)
{
	darker = shadeColor(themeColor, 0.35);

	sidebar_color = themeColor;
	sidebar_shadow_color = themeColor;
	sidebar_clicked_color = darker;
	loading_color = darker;

	$("#initial-load-area").attr("style", `background-color: ${loading_color} !important`);

	$(".base #side-menu .bb-inner-wrap>header").attr("style", `background-color: ${sidebar_color} !important; border-bottom: 2px solid ${sidebar_shadow_color} !important; box-shadow: 0 3px 0 0 ${sidebar_shadow_color} !important`);
	$(".base #side-menu").attr("style", `background-color: ${sidebar_color} !important`);

	$(".base #side-menu .off-canvas-list>li a").attr("style", `background-color: ${sidebar_color} !important`);

	$(".base #side-menu .off-canvas-list>li.active a").attr("style", `background-color: ${sidebar_clicked_color} !important`);
	$(".base #side-menu .off-canvas-list>li a").hover(function(){ $(this).attr("style", `background-color: ${sidebar_clicked_color} !important`);},
		function(){$(this).attr("style", `background-color: ${sidebar_color} !important`);});
	//

}

// Fix courses
function fixCourses()
{
	if(hide_courses) {
			$('.current-term').find('.course-element-card').each(function(i, e) {
					let title = $(this).find('.course-title h3').html().toLowerCase();
					$(this).show();
					found = false;
					for(key in actual_courses)
					{
						course = actual_courses[key].toLowerCase();
						if(title.includes(course))
						{
							found = true;
							break;

						}
					}
					if(!found) {
							$(this).hide();
					}
			});

			// Blackboard gets angry that when we remove stuff
			// Well how about I remove your error message, huh Blackboard?
			$('.reveal-modal-bg').remove();
			$('.error-something-broke-modal').remove();
	}
	else {
		$('.current-term').find('.course-element-card').each(function(i, e) {
				let title = $(this).find('.course-title h3').html();
				$(this).show();
		});
	}
}

setInterval(() => {
	fixCourses();
}, 500);

// Fix logo
let logoInterval = setInterval(() => {
    // Check if blackboard has rendered the logo
    if($('header .site-logo').length == 0)
        return;

    // It has, stop checking
    clearInterval(logoInterval);

    // Hijack logo
    $('header .site-logo').attr('src', logoURL);
}, 400);
