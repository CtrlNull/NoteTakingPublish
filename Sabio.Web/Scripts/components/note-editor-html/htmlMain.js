(function () {
    'use strict';

    angular.module(APPNAME)
        .component('noteEditorHtml', {
            templateUrl: '/Scripts/components/note-editor-html/HtmlMain.html',
            controller: 'htmlController',
            bindings: {
                note: '<',
                noteControls: '<'
            }
        });

    angular.module(APPNAME)
        .controller('htmlController', htmlController);

    htmlController.$inject = ['$scope', '$sce', '$timeout'];

    function htmlController($scope, $sce, $timeout) {
        var vm = this;
        vm.html = null;

        vm.$onInit = _onInit;

        function _onInit() {
            $scope.$watch(
                function () { return vm.editMode },
                function (editMode) {
                    if (!editMode) {
                        vm.html = $sce.trustAsHtml(vm.note.body);
                    }
                }
            );
        }

    }
})();