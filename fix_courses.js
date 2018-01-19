// Change this to fit the actual courses you want
const actual_courses = ['Spring 2018 - Senior Seminar (CCT-4053-01)', 'Spring 2018 - Numerical Methods (CS-3433-01)', 'Spring 2018 - Graduation (GN-999X-01)', 'Spring 2018 - Collbrtv Serious Game Devlpmnt (GD-3273-01)', 'Spring 2018 - Artificial Intelligence (CS-4453-01)'];

// If you don't want to hide courses for a bit, set this to false
const hide_courses = true;

// Get URLs for resources
const wallpaperURL = chrome.extension.getURL('wallpaper.jpg');
const spinnerURL   = chrome.extension.getURL('spinner.png');
const logoURL      = chrome.extension.getURL('logo.png');

// Colors
const sidebar_color = 'rgb(105, 120, 84)';
const sidebar_shadow_color = 'rgb(105, 120, 84)';
const sidebar_clicked_color = 'rgb(139, 162, 106)';
const loading_color = 'rgb(139, 162, 106)';

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

// Fix courses
setInterval(() => {
    if(hide_courses) {
        $('.current-term').find('.course-element-card').each(function(i, e) {
            let title = $(this).find('.course-title h3').html();
            if(actual_courses.indexOf(title) == -1) {
                $(this).hide();
            }
        });

        // Blackboard gets angry that when we remove stuff
        // Well how about I remove your error message, huh Blackboard?
        $('.reveal-modal-bg').remove();
        $('.error-something-broke-modal').remove();
    }
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
