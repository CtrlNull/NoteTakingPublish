(function () {
    'use strict';

    angular.module(APPNAME)
        .service('markdownService', markdownService);

    markdownService.$inject = [];

    function markdownService() {
        var svc = this;

        svc.markdownToHtml = _markdownToHtml;

        function _markdownToHtml(markdown) {
            var converter = new showdown.Converter();
            var html = converter.makeHtml(markdown);
            return html;
        }
    }
})();
