var Tccc;
(function (Tccc) {
    var TalksController = (function () {
        function TalksController(eventApi, talkApi, $routeParams) {
            var _this = this;
            this.eventApi = eventApi;
            this.talkApi = talkApi;
            this.eventId = $routeParams["eventId"];
            var talksCacheKey = TalksController.talksCacheKey + this.eventId;
            this.talks = new Tccc.List(function () { return _this.fetchTalks("Events/" + _this.eventId); }, talksCacheKey);
            this.talks.fetch();
            eventApi.getEvent("Events/" + this.eventId)
                .then(function (loadedEvent) { return _this.event = loadedEvent; });
        }
        TalksController.prototype.fetchTalks = function (eventId) {
            return this.talkApi.getTalks(eventId);
        };
        return TalksController;
    }());
    TalksController.$inject = [
        "eventApi",
        "talkApi",
        "$routeParams"
    ];
    TalksController.talksCacheKey = "talks";
    Tccc.TalksController = TalksController;
    Tccc.App.controller("TalksController", TalksController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=TalksController.js.map