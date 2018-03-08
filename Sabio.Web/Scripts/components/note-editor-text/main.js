(function () {
    'use strict';

    angular.module(APPNAME)
        .component('noteEditorText', {
            templateUrl: '/Scripts/components/note-editor-text/main.html',
            controller: 'EditorTextController',
            bindings: {
                note: '<',
                noteControls: '<'
            }
        });

    angular.module(APPNAME)
        .controller('EditorTextController', EditorTextController);

    EditorTextController.$inject = ['$timeout']

    function EditorTextController($timeout) {
        var vm = this;

        vm.note = {
            body: null
        }
        vm.handleTabKey = _handleTabKey;

        function _handleTabKey(e) {
            if (e.which === 9) {
                e.preventDefault();
                var start = e.target.selectionStart;
                var end = e.target.selectionEnd;
                vm.note.body = vm.note.body.substring(0, start) + '\t' + vm.note.body.substring(end);

                //$timeout
                $timeout(_delayed(), 10, true);
                function _delayed() {
                    angular.element(e.target).val(vm.note.body);
                    e.target.selectionStart = e.target.selectionEnd = start + 1;
                }
            }

            //Disables Ctrl + Z
            if (e.which === 90 || e.which === 17) {
                e.preventDefault();
                return false;
            }
        }
    }


    angular
        .module(APPNAME)
        .directive('autoResize', autoResize);

    autoResize.$inject = ['$timeout'];

    function autoResize($timeout) {

        var directive = {
            restrict: 'A',
            link: function autoResizeLink(scope, element, attributes, controller) {

                element.css({ 'height': 'auto', 'overflow-y': 'hidden' });
                $timeout(function () {
                    element.css('height', element[0].scrollHeight + 'px');
                }, 100);

                element.on('input', function () {
                    element.css({ 'height': 'auto', 'overflow-y': 'hidden' });
                    element.css('height', element[0].scrollHeight + 'px');

                });
            }
        };
        return directive;
    };
})();
