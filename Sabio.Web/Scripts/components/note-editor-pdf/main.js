(function(){
    angular.module(APPNAME)
        .component('noteEditorPdf', {
            templateUrl: '/Scripts/components/note-editor-pdf/main.html',
            controller: 'editorPdfController',
            bindings: {
                note: '<',
                onSave: '&'
            }
        });
    angular.module(APPNAME)
        .controller('editorPdfController', editorPdfController);
    editorPdfController.$inject = ['$scope', '$sce'];

    function editorPdfController($scope, $sce) {
        var vm = this;
        $scope.trustSrc = function(url) {
            return $sce.trustAsResourceUrl(url);
        }
    };
})();
