(function () {
    'use strict';

    angular.module(APPNAME)
        .service('notesClientSyncService', notesClientSyncService);

    notesClientSyncService.$inject = ['$http'];

    function notesClientSyncService($http) {
        var svc = this;
        svc.getTags = _getTags;
        svc.firstRequest = _firstRequest;
        svc.secondRequest = _secondRequest;

        function _getTags() {
            return $http.get('/api/noteclientsync');
        }

        function _firstRequest(data) {
            return $http({
                method: 'POST',
                url: '/api/noteclientsync/firstrequest',
                data: data,
                withCredentials: true
            })
        }

        function _secondRequest(data) {
            return $http({
                method: 'POST',
                url: '/api/noteclientsync/secondrequest',
                data: data,
                withCredentials: true
            })
        }
    }
})();