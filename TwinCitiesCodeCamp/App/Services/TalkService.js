var Tccc;
(function (Tccc) {
    var TalkService = /** @class */ (function () {
        function TalkService(apiService) {
            this.apiService = apiService;
        }
        TalkService.prototype.get = function (talkId) {
            var args = { talkId: talkId };
            var selector = function (t) { return new Tccc.Talk(t); };
            return this.apiService.query("/talks/get", args, selector);
        };
        TalkService.prototype.getSubmission = function (talkSubmissionId) {
            var args = {
                talkSubmissionId: talkSubmissionId
            };
            return this.apiService.query("/talks/getSubmission", args);
        };
        TalkService.prototype.getTalks = function (eventId) {
            var args = { eventId: eventId };
            var selector = function (talks) { return talks.map(function (t) { return new Tccc.Talk(t); }); };
            return this.apiService.query("/talks/getTalksForEvent", args, selector);
        };
        TalkService.prototype.getTalksForMostRecentEvent = function () {
            var selector = function (talks) { return talks.map(function (t) { return new Tccc.Talk(t); }); };
            return this.apiService.query("/talks/getTalksForMostRecentEvent", null, selector);
        };
        TalkService.prototype.submitTalk = function (talk) {
            return this.apiService.post("/talks/submit", talk, function (dto) { return new Tccc.Talk(dto); });
        };
        TalkService.prototype.updateTalk = function (talk) {
            return this.apiService.post("/talks/update", talk, function (dto) { return new Tccc.Talk(dto); });
        };
        TalkService.prototype.getSubmissions = function (eventId) {
            var args = {
                eventId: eventId
            };
            return this.apiService.query("/talks/getSubmissions", args, function (dtos) { return dtos.map(function (d) { return new Tccc.Talk(d); }); });
        };
        TalkService.prototype.getMySubmissions = function () {
            return this.apiService.query("/talks/getMySubmissions", null, function (dtos) { return dtos.map(function (d) { return new Tccc.Talk(d); }); });
        };
        TalkService.prototype.approve = function (talkSubmissionId) {
            return this.apiService.post("/talks/approve?talkSubmissionId=" + talkSubmissionId, null, function (dto) { return new Tccc.Talk(dto); });
        };
        TalkService.prototype.reject = function (talkSubmissionId) {
            return this.apiService.post("/talks/reject?talkSubmissionId=" + talkSubmissionId, null, function (dto) { return new Tccc.Talk(dto); });
        };
        TalkService.prototype.searchTags = function (search) {
            var args = {
                search: search
            };
            return this.apiService.query("/talks/searchTags", args);
        };
        TalkService.$inject = ["apiService"];
        return TalkService;
    }());
    Tccc.TalkService = TalkService;
    Tccc.App.service("talkApi", TalkService);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=TalkService.js.map