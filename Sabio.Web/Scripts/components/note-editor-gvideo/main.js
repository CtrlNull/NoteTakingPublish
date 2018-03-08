(function () {
    'use strict';

    angular.module(APPNAME)
        .component('noteEditorGvideo', {
            templateUrl: '/Scripts/components/note-editor-gvideo/main.html',
            controller: 'EditorGvideoController',
            bindings: {
                note: '<',
                noteControls: '<',
                onSave: '&'
            }
        });

    angular.module(APPNAME)
        .controller('EditorGvideoController', EditorGvideoController);
    EditorGvideoController.$inject = ['$element', '$scope', 'notesService'];
    function EditorGvideoController($element, $scope, notesService) {

        var vm = this;
        vm.addToFolder = _addToFolder;
        vm.uploadToFolder = _uploadToFolder;
        vm.reloadFolder = _reloadFolder;
        vm.sharedFolder = _sharedFolder;
        vm.addChildNote = _addChildNote;
        vm.showNew = false;
        vm.timeStamp = ''
        vm.secondsToTime = _secondsToTime;
        vm.isVideo = false;


        window.onclick = function (event) {
            if (event.target == $('.float-box-back')[0]) {
                $('.float-box-back').hide();
                $("#float-box-info").hide();
            }
        }

        $(document).on('click',".button-info",function () {
            FILE_COUNTER = $(this).attr("data-file-counter");
            $("#transparent-wrapper").show();
            
            $('.float-box-back').show();
            $("#float-box-info").show();
            if (DRIVE_FILES[FILE_COUNTER] != null) {
                vm.isVideo = false;
                if (DRIVE_FILES[FILE_COUNTER].isVideo)
                    vm.isVideo = true;
                $scope.$apply();
                var createdDate = new Date(DRIVE_FILES[FILE_COUNTER].createdDate);
                var vidLink = /\/d\/(.+?)\/view/.exec(DRIVE_FILES[FILE_COUNTER].alternateLink)[1];
                var modifiedDate = new Date(DRIVE_FILES[FILE_COUNTER].modifiedDate);
                $("#spanCreatedDate").html(createdDate.toString("dddd, d MMMM yyyy h:mm:ss tt"));

                $("#createVid").on('click', function () {
                    addVideo(vidLink);
                    $('.float-box-back').hide();
                    $("#float-box-info").hide();

                })



                $("#spanShareLink").html(vidLink.toString());
                $("#spanCreatedDate").html(createdDate.toString("dddd, d MMMM yyyy h:mm:ss tt"));
                $("#spanModifiedDate").html(modifiedDate.toString("dddd, d MMMM yyyy h:mm:ss tt"));
                $("#spanOwner").html((DRIVE_FILES[FILE_COUNTER].owners[0].displayName.length > 0) ? DRIVE_FILES[FILE_COUNTER].owners[0].displayName : "");
                $("#spanTitle").html(DRIVE_FILES[FILE_COUNTER].title);
                $("#spanSize").html((DRIVE_FILES[FILE_COUNTER].fileSize == null) ? "N/A" : formatBytes(DRIVE_FILES[FILE_COUNTER].fileSize));
                $("#spanExtension").html(DRIVE_FILES[FILE_COUNTER].fileExtension);
            }
        });


   


        function addVideo(text) {
            $('#drive-box').hide();

            if (!angular.isObject(vm.note.body) || angular.isArray(vm.note.body)){
                vm.note.body = {};
            }

            vm.note.body.hideDrive = true;
            vm.note.body.noteVideoElement = 'https://drive.google.com/uc?export=download&id=' + text;
            $scope.$apply();
        }





        function _addChildNote() {
            var childNote = {
                type: 'text',
                body: vm.timeStamp+ " => "+vm.subtitle,
                parents: [vm.note.id]
            };
            vm.timeStamp = '';
            vm.subtitle = '';
            vm.noteControls.addChildNote(childNote);
            $('.float-box-back').hide();
            $("#float-box-info").hide();
        }

        function _addToFolder() {
            console.log("add folder was clicked");
            $("#transparent-wrapper").show();
            $("#float-box").show();
            $("#txtFolder").val("");
        }

        function _uploadToFolder() {
            console.log("Upload button was clicked");
            $("#fUpload").click();
        }

        function _reloadFolder() {
            showLoading();
            showStatus("Loading Google Drive files...");
            getDriveFiles();
        }

        function _sharedFolder(){
            FOLDER_NAME = "";
            FOLDER_ID = "root";
            FOLDER_LEVEL = 0;
            FOLDER_ARRAY = [];
            $("#span-navigation").html("");
            $("#button-share").toggleClass("flash");
            if ($("#button-share").attr("class").indexOf("flash") >= 0) {
                $("#span-sharemode").html("ON");
            } else {
                $("#span-sharemode").html("OFF");
            }
            showLoading();
            showStatus("Loading Google Drive files...");
            getDriveFiles();
        }


        $(".btnClose, .imgClose").click(function () {
            $("#transparent-wrapper").hide();
            $(".float-box").hide();
            $('.float-box-back').hide();
        });

        $("#login-box").show()
        vm.$onInit = _onInit;
        function _onInit() {
            
            notesService.getChildNotes(vm.note.id).then(function (notes) { console.log(notes);})
            


            setTimeout(function () {
                if (!vm.note.body)
                    vm.note.body = {};
     
            },5000)
         
        

            handleClientLoad();
            if (vm.note.parents[0] === 0)
                console.log("This is Papa note!");
        }


        $("#btnAddFolder").click(function () {
            if ($("#txtFolder").val() == "") {
                alert("Please enter the folder name");
            } else {
                $("#transparent-wrapper").hide();
                $("#float-box").hide();
                showLoading();
                showStatus("Creating folder in progress...");
                var access_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

                var request = gapi.client.request({
                    'path': '/drive/v2/files/',
                    'method': 'POST',
                    'headers': {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + access_token,
                    },
                    'body': {
                        "title": $("#txtFolder").val(),
                        "mimeType": "application/vnd.google-apps.folder",
                        "parents": [{
                            "kind": "drive#file",
                            "id": FOLDERD
                        }]
                    }
                });

                request.execute(function (resp) {
                    if (!resp.error) {
                        showStatus("Loading Google Drive files...");
                        getDriveFiles();
                    } else {
                        hideStatus();
                        hideLoading();
                        showErrorMessage("Error: " + resp.error.message);
                    }
                });
            }
        });

        $("#fUpload").bind("change", function () {
            var uploadObj = $("[id$=fUpload]");
            showLoading();
            showStatus("Uploading file in progress...");
            var file = uploadObj.prop("files")[0];
            var metadata = {
                'title': file.name,
                'description': "bytutorial.com File Upload",
                'mimeType': file.type || 'application/octet-stream',
                "parents": [{
                    "kind": "drive#file",
                    "id": FOLDER_ID
                }]
            };
            var arrayBufferView = new Uint8Array(file);
            var uploadData = new Blob(arrayBufferView, { type: file.type || 'application/octet-stream' });
            showProgressPercentage(0);

            try {
                var uploader = new MediaUploader({
                    file: file,
                    token: gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token,


                    metadata: metadata,
                    onError: function (response) {
                        var errorResponse = JSON.parse(response);
                        showErrorMessage("Error: " + errorResponse.error.message);
                        $("#fUpload").val("");
                        $("#upload-percentage").hide(1000);
                        getDriveFiles();
                    },
                    onComplete: function (response) {
                        console.log("Great Success!");

                        console.log(JSON.parse(response).alternateLink);

                        console.log(JSON.parse(response).alternateLink.split('/')[5]);
                        debugger;

                        hideStatus();
                        $("#upload-percentage").hide(1000);
                        var errorResponse = JSON.parse(response);
                        if (errorResponse.message != null) {
                            showErrorMessage("Error: " + errorResponse.error.message);
                            $("#fUpload").val("");
                            getDriveFiles();
                        } else {
                            showStatus("Loading Google Drive files...");
                            getDriveFiles();
                        }
                    },
                    onProgress: function (event) {
                        showProgressPercentage(Math.round(((event.loaded / event.total) * 100), 0));
                    },
                    params: {
                        convert: false,
                        ocr: false
                    }
                });
                uploader.upload();
            } catch (exc) {
                showErrorMessage("Error: " + exc);
                $("#fUpload").val("");
                getDriveFiles();
            }
        });

        //Annotate code begins here
        window.addEventListener('keydown', function (e) {
            if (e.keyCode == 32 && e.target == document.body) {
                e.preventDefault();
                console.log('Space Down');
                var video = $('#videoPlayer')[0];
                console.log(e.which);
                if (e.which == 32) {
                    if (video.paused == true)
                        video.play();
                    else
                        video.pause();
                }
            }
        });


        $(window).keydown(function (e) {
            if (e.ctrlKey && e.which == 65) {
                e.preventDefault();
                console.log('Control Down');
                vm.showNew = true;
                console.log(Math.floor($('#videoPlayer')[0].currentTime));
                vm.timeStamp = _secondsToTime(Math.floor($('#videoPlayer')[0].currentTime));
                $('#videoPlayer')[0].currentTime -= 3;
                
                vm.noteControls.save();
                $scope.$apply();
            }
        });

        function _secondsToTime(seconds) {
            var h = Math.floor(seconds / 3600);
            var m = Math.floor(seconds % 3600 / 60);
            var s = Math.floor(seconds % 3600 % 60);
            return ((h > 0 ? (h < 10 ? "0" : "") + h + ":" : "")
                    + (m > 0 ? (m < 10 ? "0" : "") + m + ":" : "00:")
                    + (s < 10 ? "0" : "") + s);
        };

    }

})();
