(function () {
    'use strict';

    angular.module(APPNAME)
        .component('adminEditExample', {
            templateUrl: '/Scripts/components/admin-edit-example/main.html',
            controller: 'adminEditExampleController'
        });

    angular.module(APPNAME)
        .controller('adminEditExampleController', adminEditExampleController);

    adminEditExampleController.$inject = ['$stateParams'];

    function adminEditExampleController($stateParams) {
        var vm = this;

        if ($stateParams.id) {
            vm.mode = 'edit';

            //exampleService.getById($stateParams.id)
            //    .then(..., ...);
        }
        else {
            vm.mode = 'create';
        }

        vm.id = $stateParams.id;
    }
})();
