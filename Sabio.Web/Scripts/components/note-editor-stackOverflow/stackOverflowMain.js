(function () {
    'use strict';

    angular.module(APPNAME)
        .component('noteEditorStackoverflow', {
            templateUrl: '/Scripts/components/note-editor-stackOverflow/stackOverflowMain.html',
            controller: 'EditorStackOverflowController',
            bindings: {
                note: '<',
                noteControls: '<'
            }
        });

    angular.module(APPNAME)
        .controller('EditorStackOverflowController', EditorStackOverflowController);

    EditorStackOverflowController.$inject = ['notesService', 'StackOverflowService'];
    function EditorStackOverflowController(notesService, StackOverflowService) {
        var vm = this;
        vm.search = _SearchStackOverflow;
        vm.isLoading = false;

        function _SearchStackOverflow() {
            vm.isLoading = true;
            StackOverflowService
                .SearchStackOverflow(vm.note.body)
                .then(addChildNote);
        }

        function addChildNote(response) {
            vm.isLoading = false;
            for (var i = 0; i < response.data.items.length; i++) {
                var urlPrefix = "https://stackoverflow.com/questions/";
                var childNote = {
                    type: 'html',
                    title: response.data.items[i].title,
                    body: "<a target='_blank' href='" + urlPrefix + response.data.items[i].questionId + "#tab-top'>" + response.data.items[i].title + "</a>" + "<br>" + response.data.items[i].body,

                    parents: [vm.note.id]
                };
                vm.noteControls.addChildNote(childNote);
            }
        }
    }
})();