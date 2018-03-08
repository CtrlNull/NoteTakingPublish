(function () {
    'use strict'
    angular.module(APPNAME)
        .service("StackOverflowService", StackOverflowService);

    StackOverflowService.$inject = ['$http']
    function StackOverflowService($http) {

        var url = "/api/stack";
        var svc = this;

        svc.SearchStackOverflow = _SearchStackOverflow;

        function _SearchStackOverflow(title) {

            var settings = {
                url: url + "?query=" + encodeURIComponent(title),
                method: "GET",
                cache: false,
                withCredentials: true
            }
            return $http(settings)
        }

    }

})();