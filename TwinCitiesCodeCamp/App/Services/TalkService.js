var Tccc;
(function (Tccc) {
    var TalkService = (function () {
        function TalkService(apiService) {
            this.apiService = apiService;
        }
        TalkService.prototype.get = function (talkId) {
            var args = { talkId: talkId };
            var selector = function (t) { return new Tccc.Talk(t); };
            return this.apiService.query("/talks/get", args, selector);
        };
        TalkService.prototype.getTalks = function (eventId) {
            var args = { eventId: eventId };
            var selector = function (talks) { return talks.map(function (t) { return new Tccc.Talk(t); }); };
            return this.apiService.query("/talks/gettalksforevent", args, selector);
        };
        TalkService.$inject = ["apiService"];
        return TalkService;
    }());
    Tccc.TalkService = TalkService;
    Tccc.App.service("talkApi", TalkService);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=TalkService.js.map