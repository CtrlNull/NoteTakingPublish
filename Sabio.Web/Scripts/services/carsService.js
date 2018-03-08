(function () {
    'use strict';

    angular.module(APPNAME)
        .service('carsService', carsService);

    carsService.$inject = ['$q'];

    function carsService($q) {
        var svc = this;

        var cars = [
            { id: 1, make: 'Toyota', model: 'Camry', year: 2000 },
            { id: 2, make: 'BMW', model: 'Z Roadster', year: 2006 }
        ];

        svc.getAll = _getAll;
        svc.update = _update;
        svc.getById = _getById;
        svc.delete = _delete;
        svc.create = _create;

        function _getAll() {
            return $q.resolve(angular.copy(cars));
        }

        function _update(car) {
            // find the existing car with the id, remove it and replace it with the "car" parameter

            var index = null;
            for (var i = 0; i < cars.length; i++) {
                var currentCar = cars[i];
                if (currentCar.id == car.id) {
                    index = i;
                    break;
                }
            }

            cars.splice(index, 1, car);

            return $q.resolve(null);
        }

        function _getById(id) {
            for (var i = 0; i < cars.length; i++) {
                var currentCar = cars[i];
                if (currentCar.id == id) {
                    return $q.resolve(currentCar);
                }
            }

            return $q.reject('could not find that car');
        }

        function _delete(id) {
            for (var i = 0; i < cars.length; i++) {
                var currentCar = cars[i];
                if (currentCar.id == id) {
                    cars.splice(i, 1);
                    break;
                }
            }

            return $q.resolve(null);
        }

        function _create(car) {
            var nextId = 1;
            for (var i = 0; i < cars.length; i++) {
                var currentCar = cars[i];
                nextId = Math.max(nextId, currentCar.id) + 1;
            }

            car.id = nextId;
            cars.push(car);

            return $q.resolve(car.id);
        }
    }
})();