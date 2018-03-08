(function () {
    'use strict';

    // 1. Register the component with Angular

    angular.module(APPNAME)
        .component('adminViewCars', {
            templateUrl: '/Scripts/components/admin-view-cars/main.html',
            controller: 'adminViewCarsController'
        });


    // 2. Register the Angular controller

    angular.module(APPNAME)
        .controller('adminViewCarsController', adminViewCarsController);

    adminViewCarsController.$inject = ['carsService'];

    function adminViewCarsController(carsService) {
        var vm = this;

        vm.deleteCar = _deleteCar;

        carsService.getAll()
            .then(_getAllSuccess, _getAllError);

        function _getAllSuccess(cars) {
            vm.cars = cars;
        }

        function _getAllError(msg) {
            console.error(msg);
        }

        function _deleteCar(index) {
            var car = vm.cars[index];

            carsService.delete(car.id)
                .then(_deleteSuccess, _deleteError);

            function _deleteSuccess() {
                console.log('deleted car success');

                vm.cars.splice(index, 1);
            }

            function _deleteError(err) {
                console.error(err);
            }
        }
    }
})();