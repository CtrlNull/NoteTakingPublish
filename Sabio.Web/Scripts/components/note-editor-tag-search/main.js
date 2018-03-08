(function(){
    'use strict';

    angular.module(APPNAME)
        .component('noteEditorTagSearch', {
            templateUrl: '/Scripts/components/note-editor-tag-search/main.html',
            controller: 'EditorTagSearchController',
            bindings: {
                note: '<',
                noteControls: '<'
            }
        });

    angular.module(APPNAME)
        .controller('EditorTagSearchController', EditorTagSearchController);

    EditorTagSearchController.$inject = ['notesService'];

    function EditorTagSearchController(notesService){
        var vm = this;

        vm.search = _search;

        function _search(){
            notesService
                .getChildNoteIds(vm.note.id)
                .then(noteIds =>
                    notesService
                    .unlinkNotesFromParent(vm.note.id, noteIds) 
                    .then(() => notesService.getNotesWithTag(vm.note.body))
                    .then(notes => notesService.linkNotesToParent(vm.note.id, notes.map(o => o.id))));
        }
    }
})();
