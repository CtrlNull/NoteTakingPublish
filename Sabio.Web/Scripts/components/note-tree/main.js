(function(){
    'use strict';

    angular.module(APPNAME)
        .component('noteTree', {
            templateUrl: '/Scripts/components/note-tree/main.html',
            controller: 'NoteTreeController',
            bindings: {
                note: '<',
                remove: '&'
            }
        });

    
    angular.module(APPNAME)
        .controller('NoteTreeController', NoteTreeController);

    function NoteTreeController(){
    }
})();
