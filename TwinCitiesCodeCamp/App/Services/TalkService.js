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
            return this.apiService.query("/talks/getTalksForEvent", args, selector);
        };
        TalkService.prototype.submitTalk = function (talk) {
            return this.apiService.post("/talks/submit", talk);
        };
        TalkService.prototype.getSubmissions = function () {
            return this.apiService.query("/talks/getSubmissions");
        };
        TalkService.prototype.getMySubmissions = function () {
            return this.apiService.query("/talks/getMySubmissions");
        };
        TalkService.prototype.approve = function (talkSubmissionId) {
            return this.apiService.post("/talks/approve?talkSubmissionId=" + talkSubmissionId, null);
        };
        TalkService.prototype.reject = function (talkSubmissionId) {
            return this.apiService.post("/talks/reject?talkSubmissionId=" + talkSubmissionId, null);
        };
        return TalkService;
    }());
    TalkService.$inject = ["apiService"];
    Tccc.TalkService = TalkService;
    Tccc.App.service("talkApi", TalkService);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=TalkService.js.map