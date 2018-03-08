(function () {
    'use strict';

    angular.module(APPNAME)
        .service('breadcrumbService', breadcrumbService);

    function breadcrumbService(){
        const svc = this;

        svc.setPath = _setPath;
        svc.getPath = _getPath;

        let currentPath = null;

        function _setPath(path){
            currentPath = path.slice();
        }

        function _getPath(path){
            return currentPath;
        }
    }
})();
