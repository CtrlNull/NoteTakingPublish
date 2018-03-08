(function () {
    'use strict';

    angular.module(APPNAME)
        .component('noteEditorRedditSearch', {
            templateUrl: '/Scripts/components/note-editor-redditScraper/redditMain.html',
            controller: 'EditorRedditSearchController',
            bindings: {
                note: '<',
                noteControls: '<'
            }
        });

    angular.module(APPNAME)
        .controller('EditorRedditSearchController', EditorRedditSearchController);

    EditorRedditSearchController.$inject = ['notesService', 'RedditScraperService'];
    function EditorRedditSearchController(notesService, RedditScraperService) {
        var vm = this;
        vm.search = _GetFrontPage;
        vm.isLoading = false;

        function _GetFrontPage() {
            vm.isLoading = true;
            RedditScraperService
                .GetFrontPage(vm.note.body)
                .then(addChildNote);
        }

        function addChildNote(response) {//loop over items and create childnote for each item
            vm.isLoading = false;
            for (var i = 0; i < response.data.items.length; i++) {
                var urlPrefix = "https://www.reddit.com";
                var childNote;
                if (response.data.items[i].url.startsWith("/")) {
                    var childNote = {
                        type: 'html',
                        title: response.data.items[i].title,
                        body: "<a target='_blank' href='" + urlPrefix + response.data.items[i].url + "'>" + response.data.items[i].title + "</a>" ,
                        parents: [vm.note.id]
                    };
                } else {
                    var childNote = {
                        type: 'html',
                        title: response.data.items[i].title,
                        body: "<a target='_blank' href='" + response.data.items[i].url + "'>" + response.data.items[i].title + "</a>" ,
                        parents: [vm.note.id]
                    };
                }
                vm.noteControls.addChildNote(childNote);
            }
            
        }
    }
})();


