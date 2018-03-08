(function () {
    'use strict';

    angular.module(APPNAME)
        .config(configRoutes);

    configRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

    function configRoutes($stateProvider, $urlRouterProvider) {
        // All route definitions go in this function here
    
        $urlRouterProvider.otherwise('/notes');

        $stateProvider.state({
            name: 'notes',
            url: '/notes',
            component: 'notesDisplay'
        });

        $stateProvider.state({
            name: 'note',
            url: '/notes/{id}',
            component: 'notesDisplay'
        });
    }
})();