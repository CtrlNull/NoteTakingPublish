(function(){
    'use strict';

    angular.module('BananaPad')
        .component('noteTreeItem', {
            templateUrl: '/Scripts/components/note-tree-item/main.html',
            controller: 'NoteTreeItemController',
            bindings: {
                note: '<',
                remove: '&',
                parentNote: '<',
                breadcrumbPath: '<'
            }
        });

    
    angular.module('BananaPad')
        .controller('NoteTreeItemController', NoteTreeItemController);

    NoteTreeItemController.$inject = ['notesService', '$scope', '$state', 'breadcrumbService'];

    function NoteTreeItemController(notesService, $scope, $state, breadcrumbService){
        var vm = this;

        vm.$onChanges = _onChanges;
        vm.$onInit = _onInit;
        vm.getNoteTitle = _getNoteTitle;
        vm.noteClicked = _noteClicked;

        var isExpandedSessionStoreKey;

        function _onChanges(){
            if (vm.note){
                _getHasChildren();
            
                $scope.$on('note:saved:' + vm.note.id, function(e, note){
                    vm.note = angular.copy(note);
                });

                $scope.$on('note:child-saved:' + vm.note.id, function(){
                    vm.expanded = true;
                    getChildNotes();
                });
                $scope.$on('note:child-unlinked:' + vm.note.id, getChildNotes);

                isExpandedSessionStoreKey = 'note-tree-expanded:' + vm.parentId + ':' + vm.note.id;

                if (vm.note.id === 'root'){
                    vm.expanded = true;
                }
                else {
                    vm.expanded = !!sessionStorage[isExpandedSessionStoreKey];
                }

                const myPath = (vm.breadcrumbPath || []).slice();
                myPath.push(vm.note);
                vm.myPath = myPath;
            }
        }

        function getChildNotes(){
            if (vm.expanded){
                notesService.getChildNotes(vm.note.id)
                    .then(_success, console.error);

                function _success(notes){
                    vm.notes = notes;
                    vm.hasChildren = notes.length > 0;
                }
            }
            else {
                vm.notes = null;
            }
        }

        function _onInit(){
            $scope.$watch(
                () => vm.expanded,
                (expanded) => {
                    getChildNotes();

                    if (vm.note && vm.note.id !== 'root'){
                        if (expanded){
                            sessionStorage[isExpandedSessionStoreKey] = '1';
                        }
                        else {
                            delete sessionStorage[isExpandedSessionStoreKey];
                        }
                    }
                }
            );
        }

        function _getHasChildren(){
            notesService.getChildCount(vm.note.id)
                .then(_success, console.error);

            function _success(count){
                vm.hasChildren = !!count;
            }
        }

        function _noteClicked(){
            breadcrumbService.setPath(vm.breadcrumbPath);
            $state.go('note', { id: vm.note.id });
        }

        function _getNoteTitle(){
            return notesService.getNoteTitle(vm.note);
        }
    }
})();