(function () {
    'use strict'
    angular.module(APPNAME)
        .service('RedditScraperService', RedditScraperService);

    RedditScraperService.$inject = ['$http']
    function RedditScraperService($http) {

        var url = "/api/reddit";
        var svc = this;

        svc.GetFrontPage = _GetFrontPage;

        function _GetFrontPage(subReddit) {

            var settings = {
                url: url + "/" + encodeURIComponent(subReddit),
                method: "GET",
                cache: false,
                withCredentials: true
            }
            return $http(settings)
        }

    }
})();