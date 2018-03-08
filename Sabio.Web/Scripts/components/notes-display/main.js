(function(){
    'use strict';

    angular.module(APPNAME)
        .component('notesDisplay', {
            templateUrl: '/Scripts/components/notes-display/main.html',
            controller: 'notesDisplayController'
        });


    angular.module(APPNAME)
        .controller('notesDisplayController', notesDisplayController);

    notesDisplayController.$inject = ['notesService', '$stateParams', '$scope'];

    function notesDisplayController(notesService, $stateParams, $scope) {
        var vm = this;

        vm.collapsed = !!sessionStorage.tree_collapsed;

        $scope.$watch(
            () => vm.collapsed,
            collapsed => {
                if (collapsed){
                    sessionStorage.tree_collapsed = 1;
                }
                else {
                    delete sessionStorage.tree_collapsed;
                }
            }
        );

        if ($stateParams.id){
            notesService.getById($stateParams.id)
                .then(_success, err => console.error(err));

            function _success(note){
                vm.rootNote = note;
            }
        }
        else {
            vm.rootNote = {
                id: "root",
                title: 'All Notes'
            };
        }
    }
})();
