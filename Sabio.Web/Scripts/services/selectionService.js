(function () {
    'use strict';

   

    angular.module(APPNAME)
        .service('selectionService', selectionService);

    function selectionService() {
        var svc = this;
        svc.selected = {};
        
    }
    
})();