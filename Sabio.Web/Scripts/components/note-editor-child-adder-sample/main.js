(function(){
    'use strict';

    angular.module(APPNAME)
        .component('noteEditorChildAdderSample', {
            templateUrl: '/Scripts/components/note-editor-child-adder-sample/main.html',
            controller: 'EditorChildAdderSampleController',
            bindings: {
                note: '<',
                noteControls: '<'
            }
        });

    angular.module(APPNAME)
        .controller('EditorChildAdderSampleController', EditorChildAdderSampleController);

    EditorChildAdderSampleController.$inject = ['notesService'];

    function EditorChildAdderSampleController(notesService){
        var vm = this;

        vm.keyDown = _keyDown;

        function _keyDown(event){
            if (event.ctrlKey && event.which === 13){ // Ctrl+Enter
                var childNote = {
                    type: 'text',
                    body: vm.note.body,
                    parents: [vm.note.id]
                };

                vm.noteControls.addChildNote(childNote);

                vm.note.body = '';
            }
        }
    }
})();
