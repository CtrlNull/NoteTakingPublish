(function () {
    'use strict';

    angular.module(APPNAME)
        .component('noteEditorTodos', {
            templateUrl: '/Scripts/components/note-editor-todos/main.html',
            controller: 'TodosController',
            bindings: {
                note: '<',
                noteControls: '<'
            }
        });

// // // // // // // // // // // // // // // // // // // // //

    angular.module(APPNAME)
        .controller('TodosController', TodosController)
    
    function TodosController() {

        var ctrl = this;

        ctrl.removeCheckedItems = _removeCheckedItems;
        ctrl.saveTodoListTitle = _saveTodoListTitle;
        ctrl.createTodoListTitle = _createTodoListTitle;
        ctrl.deleteTodoItem = _deleteTodoItem;
        ctrl.addTodoItem = _addTodoItem;
        ctrl.$onInit = _onInit;
        ctrl.hasCheckedItems = _hasCheckedItems; 

       

        function _onInit() {
            console.log("the _onInit function is firing");
            if (!Array.isArray(ctrl.note.body)) {/* if "ctrl.note.body" is NOT an array...  */
                ctrl.note.body = []; /*... make IT an array*/
            }
        }

        function _hasCheckedItems() {
            return ctrl.note.body.find(todo => todo.done);
        }
               
        function _addTodoItem() {
            console.log("the _addTodoItem function is firing");

            if (ctrl.newTodoItem) { // that "if" avoids having an empty item populating the dom (if the user deletes the whole think and press enter)

                ctrl.note.body.push({ text: ctrl.newTodoItem, done: false });   /*goes with line #2 in HTML file*/

                ctrl.newTodoItem = null;

                ctrl.noteControls.save(); /*AlfredoAlfredo: check the code for this function */

            }

        }

        function _createTodoListTitle() {

            ctrl.editingTitle({ text: ctrl.note.title, editingTitle: false }); 
            
        }

        function _saveTodoListTitle() {
            ctrl.editingTitle = false;
            ctrl.noteControls.save();

        }

        function _removeCheckedItems() {
            
            ctrl.note.body = ctrl.note.body.filter(todo => !todo.done); // keep the ones that are "done:true"

            ctrl.noteControls.save();
        }

        
        function _deleteTodoItem(index) {
            
            console.log("the _deleteTodoItem function is firing");

            var todosArray = ctrl.note.body;
            todosArray.splice(index, 1);

            ctrl.noteControls.save();
        }
    }            
})();