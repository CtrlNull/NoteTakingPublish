(function(){
    'use strict';

    angular.module('BananaPad')
        .component('noteEditorGraphviz', {
            templateUrl: '/Scripts/components/note-editor-graphviz/main.html',
            controller: 'EditorGraphvizController',
            bindings: {
                note: '<',
                noteControls: '<'
            }
        });
    

    angular.module('BananaPad')
        .controller('EditorGraphvizController', EditorGraphvizController);

    EditorGraphvizController.$inject = ['$scope', '$sce', '$timeout'];

    function EditorGraphvizController($scope, $sce, $timeout){
        var vm = this;

        $scope.$watch(
            function(){ return vm.editMode },
            function(editMode){
                if (!editMode){
                    vm.rendering = true;
                    // TODO: do this in a Web Worker
                    $timeout(function(){
                        try {
                            var svg = Viz(vm.note.body);
                            svg = svg.replace(
                                /(<svg.+?)width=".+?".+?height="(.+?)"/,
                                (m, c1, c2) => c1 + 'style="max-width: 100%; max-height: ' + c2 + '"'
                            );
                            vm.svg = $sce.trustAsHtml(svg);
                            vm.errorMessage = null;
                        }
                        catch (e){
                            vm.svg = null;
                            vm.errorMessage = String(e);
                        }

                        vm.rendering = false;
                    }, 1);
                }
            }
        );
    }
})();
