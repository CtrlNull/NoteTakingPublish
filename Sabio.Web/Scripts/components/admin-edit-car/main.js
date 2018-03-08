(function () {
    'use strict';

    angular.module(APPNAME)
        .component('adminEditCar', {
            templateUrl: '/Scripts/components/admin-edit-car/main.html',
            controller: 'adminEditCarController'
        });


    angular.module(APPNAME)
        .controller('adminEditCarController', adminEditCarController);

    adminEditCarController.$inject = ['carsService', '$stateParams', '$state'];

    function adminEditCarController(carsService, $stateParams, $state) {
        var vm = this;

        vm.save = _save;

        if ($stateParams.id) {
            carsService.getById($stateParams.id)
                .then(_getByIdSuccess, _getByIdError);

            function _getByIdSuccess(car) {
                vm.car = car;
            }

            function _getByIdError(err) {
                console.error(err);
            }
        }

        function _save() {
            if ($stateParams.id) {
                // update
                carsService.update(vm.car)
                    .then(_updateSuccess, _updateError);

                function _updateSuccess() {
                    $state.go('view-cars');
                }

                function _updateError(err) {
                    console.error(err);
                }
            }
            else {
                // create
                carsService.create(vm.car)
                    .then(_createSuccess, _createError);

                function _createSuccess(id) {
                    console.log('created a new car with id ' + id);
                    $state.go('view-cars');
                }

                function _createError(err) {
                    console.error(err);
                }
            }
        }
    }
})();