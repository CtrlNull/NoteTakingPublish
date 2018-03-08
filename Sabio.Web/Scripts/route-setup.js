(function () {
    'use strict';

    angular.module(APPNAME)
        .config(configRoutes);

    configRoutes.$inject = ['$stateProvider'];

    function configRoutes($stateProvider) {
        // All route definitions go in this function here

        /*
        Example URLs for entities:

        /admin/entity/tags (view all tags screen)
        /admin/entity/tags/123 (edit a specific tag, the route is actually defined as /admin/entity/tags/{id})
        /admin/entity/tags/new (screen to create a new tag)
        */

        $stateProvider.state({
            name: 'edit-exampleentity',
            url: '/admin/entity/example/{id:int}',
            component: 'adminEditExample'
        });

        $stateProvider.state({
            name: 'create-exampleentity',
            url: '/admin/entity/example/new',
            component: 'adminEditExample'
        });

        /*
        URLS for cars:
        /admin/entity/cars   (views the table of all cars)
        /admin/entity/cars/123   (edit a specific car that already exists)
        /admin/entity/cars/new   (create a new car)
        */

        $stateProvider.state({
            name: 'view-cars',
            url: '/admin/entity/cars',
            component: 'adminViewCars'
        });

        $stateProvider.state({
            name: 'edit-cars',
            url: '/admin/entity/cars/{id:int}',
            component: 'adminEditCar'
        });

        $stateProvider.state({
            name: 'create-cars',
            url: '/admin/entity/cars/new',
            component: 'adminEditCar'
        });
    }
})();