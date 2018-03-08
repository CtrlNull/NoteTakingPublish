(function () {
    'use strict';

    window.APPNAME = 'BananaPad';

    var app = angular.module(APPNAME, ['ui.router', 'ngTagsInput']);

    app.run(() => {
        const splashElem = document.getElementById('splash');
        splashElem.classList.add('fadeOut');

        function animationComplete(){
            splashElem.removeEventListener('webkitAnimationEnd', animationComplete, false);
            splashElem.removeEventListener('animationend', animationComplete, false);
            splashElem.removeEventListener('oanimationend', animationComplete, false);

            splashElem.remove();
        }

        splashElem.addEventListener('webkitAnimationEnd', animationComplete, false);
        splashElem.addEventListener('animationend', animationComplete, false);
        splashElem.addEventListener('oanimationend', animationComplete, false);
    });
    

    // add X-Requested-With: XMLHttpRequest to all of our ajax calls (so that the server knows
    // to not redirect to the login page when unauthorized)
    app.config(ConfigureHttp);
    ConfigureHttp.$inject = ['$httpProvider'];
    function ConfigureHttp($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }

    // enable HTML5-compatible URLs
    app.config(ConfigureLocationProvider);
    ConfigureLocationProvider.$inject = ['$locationProvider'];
    function ConfigureLocationProvider($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
})();
