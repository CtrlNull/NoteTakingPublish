(function () {
    'use strict';

    angular.module(APPNAME)
        .service('notesService', notesService);

    /*
    -------------------------
    A "note" looks like this:
    {
        "id": "faca6b71720a47cbbc0c471ab7dfb84d-48", // guid + local ID
        "revision": 1, // incremented every time we save the note
        "type": "text", // could be anything: "text", "markdown", "youtube", "graphviz", etc.
        "body": null, // this can be whatever you want, a string, an object, anything.
        "parents": [] // ids of parent, or ["root"] if this is a top-level note.
                      // DO NOT directly modify this array. Only use public functions
                      // from this notesService to add/remove child notes!!
        "dateCreated": auto-populated Date object
        "dateModified": auto-populated Date object
    }


    ----------------------------------------------------
    Angular messages that are broadcast from $rootScope:

    When a note is saved:
    "note:saved:faca6b71720a47cbbc0c471ab7dfb84d-48"           data: none

    When a note's child was saved:
    "note:child-saved:faca6b71720a47cbbc0c471ab7dfb84d-48"     data: [childId, childId, ...]

    When one or more of a note's children are unlinked:
    "note:child-unlinked:faca6b71720a47cbbc0c471ab7dfb84d-48"  data: [childId, childId, ...]


    ----------------------------
    Things kept in localStorage:

    localStorage.guid       something like "faca6b71720a47cbbc0c471ab7dfb84d"
    localStorage.localId    starts at 0, will be incremented by one every time a new note ID is generated.
    */

    notesService.$inject = ['$q', '$rootScope', '$http'];

    function notesService($q, $rootScope, $http) {
        const svc = this;


        svc.getById = _getById;
        svc.getChildCount = _getChildCount;
        svc.getChildNotes = _getChildNotes;
        svc.getChildNoteIds = _getChildNoteIds;
        svc.getNotesWithTag = _getNotesWithTag;
        svc.saveNote = _saveNote;
        svc.unlinkNotesFromParent = _unlinkNotesFromParent;
        svc.linkNotesToParent = _linkNotesToParent;
        svc.syncWithServer = _syncWithServer;
        svc.getAllNotes = _getAllNotes;
        svc.getAllNoteIds = _getAllNoteIds;
        svc.getNoteTitle = _getNoteTitle;
        svc.sendNotesToServer = _sendNotesToServer;


        // ↑↑↑↑↑↑↑↑ above: PUBLIC INTERFACE. Please use these functions from anywhere in the AngularJS application.
        // xxxxxxxx
        // ↓↓↓↓↓↓↓↓ below: INTERNAL implementation details. DO NOT use these functions from outside this file.


        // Note: this implementation relies on "IndexedDB Promised" instead of using the standard IndexedDB APIs.
        // See:
        // https://github.com/jakearchibald/idb#readme
        // https://developers.google.com/web/ilt/pwa/working-with-indexeddb


        // Wait on this promise whenever you need to use our IndexedDB database:
        const dbPromise = idb.open('user-data', 3, (upgradeDb) => {
            // This is the "database migration" portion:
            switch (upgradeDb.oldVersion) {
                case 0:
                    upgradeDb.createObjectStore('notes', { keyPath: 'id', unique: true })
                        .createIndex('parents', 'parents', { unique: false, multiEntry: true });
                case 1:
                    upgradeDb.transaction.objectStore('notes')
                        .createIndex('dateCreated', 'dateCreated', { unique: false, multiEntry: true });
                case 2:
                    upgradeDb.transaction.objectStore('notes')
                        .createIndex('tags', 'tags', { unique: false, multiEntry: true });
            }
        });

        // If you ever need a GUID that is unique for this user, wait on this promise.
        // A user's GUID is cached in localStorage.guid. This is to facilitate offline note creation.
        // If localStorage.guid is not present on startup, we'll ask the server for a new GUID
        // (since there doesn't seem to be a good way to generate a GUID in a browser, unfortunately).
        const guidPromise = new Promise((resolve, reject) => {
            const savedGuid = localStorage.guid;

            if (savedGuid) {
                // luckily, we have a GUID in localStorage. Let's just resolve the promise right now:
                resolve(savedGuid);
            }
            else {
                // We don't have a GUID in localStorage. We'll ask the server for a GUID, then resolve the
                // promise once that XHR (a.k.a. "ajax call") has completed.
                //
                // Note: using fetch here instead of $http since we always use the native Promise implementation
                // with IndexedDB. We'll only use $q when we need to interoperate with AngularJS code outside
                // of this file. Since guidPromise isn't public, we won't worry about $q here.
                fetch('/api/guid')
                    .then(response => response.json())
                    .then(guid => {
                        localStorage.guid = guid;
                        resolve(guid);
                    }, reject);
            }
        });

        // Generates a unique note ID (even while offline) that is guaranteed to not clash between different
        // users anywhere in the world, assuming of course that no one is purposefully tampering with localStorage.
        // This function is an essential ingredient in our ability to still work well for the user while offline.
        //
        // Note: if you call this function to get a new ID but then you end up not using that ID,
        // that's totally fine. It's ok to throw away unused IDs. This function serves only to prevent
        // duplicate global IDs.
        function claimNextNoteId() {
            return guidPromise
                .then(guid => {
                    const localId = (parseInt(localStorage.localId) || 0) + 1;
                    localStorage.localId = localId;
                    return guid + "-" + localId; // looks something like "faca6b71720a47cbbc0c471ab7dfb84d-1"
                });
        }

        // uncomment this function to enable verbose console logging
        function log(){
            //console.log.apply(console, arguments);
        }

        // This is a helper function for use in this file. If you want to broadcast a message, call this function
        // instead of directly using $rootScope.$broadcast since this function also logs the message for
        // the developer to see.
        function broadcast(message, data) {
            log('$broadcast ' + message, data);
            $rootScope.$broadcast(message, data);
        }

        // implementation of svc.getById
        function _getById(id) {
            log('notesService.getById', id);

            const promise =
                dbPromise.then(db =>
                    db.transaction('notes')
                        .objectStore('notes')
                        .get(id));


            // convert native Promise to AngularJS $q promise
            return $q((resolve, reject) => promise.then(resolve, reject));
        }

        // implementation of svc.saveNote
        function _saveNote(note) {
            log('notesService.saveNote id:' + note.id, note);

            if (!note.parents || note.parents.length == 0) {
                throw new Error("Invalid parents array on note. Every note must have a parent. For a top-level note, set the parent to \"root\".");
            }

            // make sure there are no duplicate parent IDs:
            const seen = {};
            for (let i = 0; i < note.parents.length; i++) {
                const parentId = note.parents[i];
                if (seen[parentId]) {
                    throw new Error("Duplicate parent ID: " + parentId);
                }
                seen[parentId] = true;
            }

            if (!note.dateCreated) {
                note.dateCreated = new Date();
            }
            note.dateModified = new Date();

            if (note.revision) {
                note.revision += 1;
            }
            else {
                note.revision = 1;
            }

            // assertion: at this point, we know this is a valid note

            const noteToSave = angular.copy(note);
            delete noteToSave.$$hashkey; // todo: remove angular stuff recursively

            const promise =
                new Promise((resolve, reject) => {
                    if (!noteToSave.id) {
                        claimNextNoteId()
                            .then(noteId => {
                                noteToSave.id = noteId;
                                note.id = noteId; // yuck: mutate original note instance, but helpful for the caller
                                resolve();
                            }, reject);
                    }
                    else {
                        resolve();
                    }
                })
                    .then(() =>
                        dbPromise.then(db =>
                            db.transaction('notes', 'readwrite')
                                .objectStore('notes')
                                .put(noteToSave)
                                .then(() => {
                                    // let the rest of the program know this note has changed
                                    broadcast('note:saved:' + noteToSave.id, noteToSave);

                                    // let every parent note know that the child has changed
                                    for (let parentId of noteToSave.parents) {
                                        broadcast('note:child-saved:' + parentId, { childId: noteToSave.id });
                                    }

                                    return noteToSave.id;
                                })));

            // convert native Promise to AngularJS $q promise
            return $q((resolve, reject) => promise.then(resolve, reject));
        }


        // implementation of svc.getChildNotes
        function _getChildNotes(parentId) {
            log('notesService.getChildNotes', parentId);

            const promise =
                dbPromise.then(db =>
                    db.transaction('notes')
                        .objectStore('notes')
                        .index('parents')
                        .getAll(IDBKeyRange.only(parentId)));

            return $q(function (resolve, reject) {
                promise.then(resolve, reject);
            });
        }


        // implementation of svc.getChildNoteIds
        function _getChildNoteIds(parentId) {
            log('notesService.getChildNoteIds', parentId);

            const promise =
                dbPromise.then(db =>
                    tx_GetChildNoteIds(db.transaction('notes'), parentId));

            // convert native Promise to AngularJS $q promise
            return $q((resolve, reject) => promise.then(resolve, reject));
        }

        function tx_GetChildNoteIds(tx, parentId) {
            return tx
                .objectStore('notes')
                .index('parents')
                .getAllKeys(IDBKeyRange.only(parentId));
        }


        // implementation of svc.getChildCount
        function _getChildCount(parentId) {
            log('notesService.getChildCount', parentId);

            const promise =
                dbPromise.then(db =>
                    db.transaction('notes')
                        .objectStore('notes')
                        .index('parents')
                        .getAllKeys(IDBKeyRange.only(parentId))
                        .then(ids => ids.length));

            // convert native Promise to AngularJS $q promise
            return $q((resolve, reject) => promise.then(resolve, reject));
        }


        // implementation of svc.unlinkNotesFromParent
        function _unlinkNotesFromParent(parentId, noteIds) {
            log('notesService.unlinkNotesFromParent', parentId, JSON.stringify(noteIds));

            if (noteIds.length == 0) {
                return $q.resolve();
            }

            const promise =
                dbPromise.then(db =>
                    tx_UnlinkNotesFromParent(
                        db.transaction('notes', 'readwrite'),
                        parentId,
                        noteIds))
                    .then(() => {
                        broadcast('note:child-unlinked:' + parentId, noteIds);
                    });

            // convert native Promise to AngularJS $q promise
            return $q((resolve, reject) => promise.then(resolve, reject));
        }

        function tx_UnlinkNotesFromParent(tx, parentId, noteIds) {
            return Promise.all(
                noteIds
                    .map(noteId =>
                        tx.objectStore('notes')
                            .get(noteId)
                            .then(note => {
                                const index = note.parents.indexOf(parentId);
                                if (index < 0) {
                                    throw new Error('invalid parent id ' + parentId + ' while unlinking note ' + noteId);
                                }

                                note.parents.splice(index, 1);

                                if (note.parents.length == 0) {
                                    return tx_GetChildNoteIds(tx, noteId)
                                        .then(childNoteIds => tx_UnlinkNotesFromParent(tx, noteId, childNoteIds))
                                        .then(() => tx.objectStore('notes').delete(noteId));
                                }
                                else {
                                    return tx.objectStore('notes').put(note);
                                }
                            })));
        }


        // implementation of svc.getNotesWithTag
        function _getNotesWithTag(tag) {
            log('notesService.getNotesWithTag', tag);

            const promise =
                dbPromise.then(db =>
                    db.transaction('notes')
                        .objectStore('notes')
                        .index('tags')
                        .getAll(IDBKeyRange.only(tag)));

            // convert native Promise to AngularJS $q promise
            return $q((resolve, reject) => promise.then(resolve, reject));
        }


        // implementation of svc.linkNotesToParent
        function _linkNotesToParent(parentId, noteIds) {
            log('notesService.linkNotesToParent', parentId, JSON.stringify(noteIds));

            if (noteIds.length == 0) {
                return $q.resolve();
            }

            const promise =
                dbPromise.then(db => {
                    const tx = db.transaction('notes', 'readwrite');

                    return Promise.all(
                        noteIds
                            .map(noteId =>
                                tx.objectStore('notes')
                                    .get(noteId)
                                    .then(note => {
                                        note.parents.push(parentId);
                                        return tx.objectStore('notes').put(note);
                                    })));
                });

            // convert native Promise to AngularJS $q promise
            return $q((resolve, reject) => promise.then(resolve, reject));
        }

        function _getNewGuid() {
            return $http({
                url: '/api/backup/guid',
                method: 'GET'
            }).then(response => response.data);
        }

        // implementation of svc.syncWithServer
        function _syncWithServer() {

            // read notes from IndexedDB
            var promise =
                dbPromise.then(db =>
                    db.transaction('notes')
                        .objectStore('notes')
                        .getAll().then(_promiseComplete, error => console.error(error)));

            // create NoteBackupRequest model for .NET controller
            function _promiseComplete(response) {
                var noteBackupRequest = [];

                response.forEach(function (note) {
                    var globalNoteId = {};

                    globalNoteId.noteGuid = note.id;
                    globalNoteId.revision = note.revision;

                    noteBackupRequest.push(globalNoteId);
                });

                console.log('notesService.syncWithServer local note IDs sent to server:', noteBackupRequest);

                // send backup request to server
                return $http({
                    url: '/api/backup/sync',
                    method: 'POST',
                    data: { GlobalNoteIds: noteBackupRequest }
                });
            }

            // return a promise
            return $q((resolve, reject) =>
                promise.then(resolve, reject));
        }

        // implementation of svc.sendNotesToServer
        function _sendNotesToServer(noteIds) {
            console.log('notesService.sendNotesToServer notes the server needs:', noteIds);

            const noteUpdateRequest = [];

            const allPromises =
                noteIds
                    .map(note =>
                        svc.getById(note.noteGuid)
                            .then(response =>
                                noteUpdateRequest.push(response)));

            const allDonePromise = $q.all(allPromises);

            allDonePromise
                .then(
                () => {
                    return $http({
                        url: '/api/backup/update',
                        method: 'POST',
                        data: { Notes: noteUpdateRequest }
                    });
                },
                error => console.error(error)
                );
        }

        // implementation of svc.getAllNotes
        function _getAllNotes() {
            const promise =
                dbPromise.then(db =>
                    db.transaction('notes')
                        .objectStore('notes')
                        .getAll());

            // convert native Promise to AngularJS $q promise
            return $q((resolve, reject) => promise.then(resolve, reject));
        }

        // implementation of svc.getAllNoteIds
        function _getAllNoteIds() {
            const promise =
                dbPromise.then(db =>
                    db.transaction('notes')
                        .objectStore('notes')
                        .getAllKeys());

            // convert native Promise to AngularJS $q promise
            return $q((resolve, reject) => promise.then(resolve, reject));
        }

        // implementation of _getNoteTitle
        function _getNoteTitle(note){
            try {
                return (note && note.title) ||
                    (note && note.body || '').split('\n', 2)[0] ||
                    '(untitled)';
            }
            catch (e){
                return '(untitled)';
            }
        }
    }
})();
