(function () {
    'use strict';

    angular.module('BananaPad')
        .component('toolBar', {
            templateUrl: '/Scripts/components/tool-bar/main.html',
            controller: 'ToolBarController',
            bindings: {
                note: '<',
                remove: '&'
            }
        });

    angular.module('BananaPad')
        .controller('ToolBarController', ToolBarController);

    ToolBarController.$inject = ['notesService', '$scope'];

    function ToolBarController(notesService, $scope) {
        var vm = this;

        vm.introjs = function () {
            introJs().start();
        }

        vm.toggleLightTheme = _toggleLightTheme;
        vm.toggleDarkTheme = _toggleDarkTheme;
        vm.syncWithServer = _syncWithServer;
        vm.speak = _speak;
        vm.btnGithub = _btnGithub;

        vm.playerStatus = {
            status: "Play Aloud",
            isActive: false
        };

        vm.modes = {
            default: "Play Aloud",
            playing: "Playing",
            pause: "Pause",
            resume: "Resume",
            restart: "Play From Beginning",
            replay: "Replay",
            cancel: "Clear Selections"
        };

        window.addEventListener('select', function () { //addeventlistener: https://developer.mozilla.org/en-US/docs/Web/Events/select
            console.log("window.addEventListener fired - text selected!");
            vm.playerStatus.status = vm.modes.default;
            $scope.$apply();
        }, false);

        function _btnGithub() {
            console.log("github button");
            var w = 600;
            var h = 600;
            var left = (screen.width / 2) - (w / 2);
            var top = (screen.height / 2) - (h / 2);
            return window.location.href =
                'https://github.com/login/oauth/authorize?' +
                'client_id=df80bc5f88b4806c4269&' +
                //'client_secret=0c79495a0554154bc09f3d95fd92220b35c86c2e&' +
                'state=fdsafdghfadkfjadp&' +
                'redirect_uri=' + encodeURIComponent(window.location.origin + '/api/oauth/github')
        }


        function _speak() {
            if (vm.playerStatus.isActive) {
                vm.playerStatus.isActive = false;
                speechSynthesis.cancel();
                return;
            }

            var u = new SpeechSynthesisUtterance();
            u.lang = 'en-US';
            u.rate = 1.2;
            u.text = window.getSelection();
            speechSynthesis.speak(u);
            vm.playerStatus.isActive = true;
            u.onend = function (event) { //https://developer.mozilla.org/en-US/docs/Web/Events/end_(SpeechSynthesis)
                vm.playerStatus.status = vm.modes.replay;
                vm.playerStatus.isActive = false;
                $scope.$apply();
            }
        }

        function _toggleLightTheme() {
            console.log('_toggleLightTheme fired');
            document.getElementById('dark-theme').setAttribute('disabled', '');
        }

        function _toggleDarkTheme() {
            document.getElementById('dark-theme').removeAttribute('disabled');
        }

        function _syncWithServer() {
            notesService.syncWithServer()
                .then(response => notesService.sendNotesToServer(response.data.items));
        }
    }


    angular.module(APPNAME)
        .controller('NoteClientSyncController', NoteClientSyncController);

    NoteClientSyncController.$inject = ['$scope', '$http', 'notesService', 'notesClientSyncService'];

    function NoteClientSyncController($scope, $http, notesService, notesClientSyncService) {
        var vm = this;
        vm.sync = _sync;
        $scope.tags = [];
        vm.getAllNotesResponse;

        $scope.loadTags = function ($query) {
            return notesClientSyncService.getTags()
                .then(function (response) {
                    var tags = response.data;
                    return tags.filter(function (tags) {
                        return tags.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
                    });
                });
        };

        function _sync() {
            var tagArr = [];
            for (var i = 0; i < $scope.tags.length; i++) {
                tagArr.push($scope.tags[i].name);
            }

            var min = vm.dateMin;
            var max = vm.dateMax;
            if (min != undefined) {
                var shortDateMin = min.getFullYear() + "-" + ("0" + (min.getMonth() + 1)).slice(-2) + "-" + ("0" + min.getDate()).slice(-2) + " 00:00:00";
            }
            if (max != undefined) {
                var shortDateMax = max.getFullYear() + "-" + ("0" + (max.getMonth() + 1)).slice(-2) + "-" + ("0" + max.getDate()).slice(-2) + " 23:59:59";
            }

            var dateMin = shortDateMin || null;
            var dateMax = shortDateMax || null;

            var tagPost = {
                'tags': tagArr,
                'Date_Min': dateMin,
                'Date_Max': dateMax
            }
            notesClientSyncService.firstRequest(tagPost)
                .then(onSuccess);

            function onSuccess(response) {
                var missingGuid = [];

                notesService.getAllNotes()
                    .then(function (response) {
                        vm.getAllNotesResponse = response;
                    })
                    .then(function () {
                        var existingGuid = [];
                        var responseGuid = [];

                        for (var i = 0; i < vm.getAllNotesResponse.length; i++) {
                            var reNum = new RegExp("^[0-9]{2}$");
                            var testGuid = vm.getAllNotesResponse[i].id;

                            if (!reNum.test(testGuid)) {
                                console.log("Tested IndexedDB", vm.getAllNotesResponse[i].id);
                                var guids = vm.getAllNotesResponse[i].id;

                                if ((/-[0-9]{\d+:\d+\}/g).test(guids)) {
                                    var guids = guids.replace(/-[0-9]{\d+:\d+\}/g, "");
                                }
                                existingGuid.push(guids);
                            }
                        };

                        for (var i = 0; i < response.data.length; i++) {
                            responseGuid.push(response.data[i].note_Guid);
                        }
                        console.log("Response - Guid", responseGuid);
                        console.log("IndexedDB - Guid", existingGuid);
                        return missingGuid = _.difference(responseGuid, existingGuid);
                    })

                    .then(function () {
                        if (missingGuid.length == 0 || !missingGuid) {
                            alert("Notes Fully Synced");
                        }
                        else {
                            var requestGuid = {
                                note_guid: missingGuid
                            };

                            notesClientSyncService.secondRequest(requestGuid)
                                .then(function (response) {
                                        var parentNote = {
                                            type: "text",
                                            body: "Notes Request from the Server",
                                            parents: ["root"],
                                            dateCreated: null,
                                            dateModified: null
                                        }

                                    notesService.saveNote(parentNote)
                                        .then(function () {
                                            for (var i = 0; i < response.data.length; i++) {
                                                var note = {
                                                    id: response.data[i].note_Guid,
                                                    revision: response.data[i].revision,
                                                    type: "text",
                                                    body: response.data[i].content,
                                                    parents: [parentNote.id],
                                                    dateCreated: response.data[i].date_Created,
                                                    dateModified: response.data[i].date_Modified
                                                }
                                                notesService.saveNote(note);
                                            }
                                        });
                                })
                        }
                    })
            }
        }
    }
})();
