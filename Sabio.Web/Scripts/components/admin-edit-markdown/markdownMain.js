(function () {
    'use strict';

    angular.module(APPNAME)
        .component('noteEditorMarkdown', {
            templateUrl: '/Scripts/components/admin-edit-markdown/markdownMain.html',
            controller: 'markdownController',
            bindings: {
                note: '<',
                noteControls: '<'
            }
        });

    angular.module(APPNAME)
        .controller('markdownController', markdownController);

    markdownController.$inject = ['markdownService', '$scope', '$sce', '$timeout'];

    function markdownController(markdownService, $scope, $sce, $timeout) {
        var vm = this;

        vm.html = null;

        vm.$onInit = _onInit;

        function _onInit() {
            $scope.$watch(//watches for changes
                function () { return vm.editMode },
                function (editMode) {
                    if (!editMode) {
                        vm.html = $sce.trustAsHtml(markdownService.markdownToHtml(vm.note.body));

                        

                    }
                }
            );
        }
        
    }
})();