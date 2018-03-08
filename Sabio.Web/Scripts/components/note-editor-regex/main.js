// JS - FOR REGEX PLAYGROUND
(function () {
    'use strict';

    angular.module(APPNAME)
        .component('noteEditorRegex', {
            templateUrl: '/Scripts/components/note-editor-regex/main.html',
            controller: 'EditorRegexController',
            bindings: {
                note: '<',
                onSave: '&'
            }
        });

    angular.module(APPNAME)
        .controller('EditorRegexController', EditorRegexController);

    EditorRegexController.$inject = ['notesService']

    function EditorRegexController(notesService) {
        var vm = this;
        vm.isRegExValid = true;
        vm.inputChange = _inputChange;
        vm.note = {
            body: {
                regex: null,
                test: null
            }
        };

        //INPUT CHANGES MATCHING REGEX WITH TEST VALUES
        function _inputChange() {
            console.log('asdf');
            vm.matchedRegex;
            var testString;
            var reg;
            var regExp;

            try {
                testString = vm.note.body.test;
                reg = vm.note.body.regex;
            } catch (e) {
                console.log(e.message);
            }

            try {
                if ((/\//.test(reg)) == true || !vm.note.body.regex) {
                    vm.isRegExValid = false;
                } else {
                    regExp = new RegExp(vm.note.body.regex);
                    vm.isRegExValid = true;
                }
            } catch (e) {
                vm.isRegExValid = false;
                console.log(e.message);
            }

            try {
                if (vm.note.body.regex == null || vm.note.body.test == null || !vm.isRegExValid) {
                    vm.matchedRegex = null;
                    return;
                } else if (!regExp.test(testString)) {
                    vm.matchedRegex = ["No matching regular expressions."];
                } else {
                    vm.matchedRegex = testString.match(regExp);
                    return regExp.test(testString);
                }
            } catch (e) {
                console.log(e.message);
            }
        }
    }
})();