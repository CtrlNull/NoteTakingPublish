(function(){
    'use strict';

    angular.module(APPNAME)
        .service('exampleEntityService', exampleEntityService);

    exampleEntityService.$inject = ['$http'];

    function exampleEntityService($http) {
        var svc = this;

        svc.getAll = _getAll;

        function _getAll() {
            return $http({
                method: 'GET',
                url: '/api/example-entity'
            });
        }
    }
})();
