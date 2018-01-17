var Tccc;
(function (Tccc) {
    var TalksController = /** @class */ (function () {
        function TalksController(eventApi, talkApi, $routeParams) {
            var _this = this;
            this.eventApi = eventApi;
            this.talkApi = talkApi;
            this.$routeParams = $routeParams;
            this.eventId = $routeParams["eventId"];
            var talksCacheKey = TalksController.talksCacheKey + this.eventId;
            this.talks = new Tccc.List(function () { return _this.fetchTalks("Events/" + _this.eventId); }, talksCacheKey);
        }
        TalksController.prototype.$onInit = function () {
            var _this = this;
            this.eventApi.getEvent("events/" + this.eventId)
                .then(function (loadedEvent) { return _this.event = loadedEvent; });
            this.talks.fetch();
        };
        TalksController.prototype.fetchTalks = function (eventId) {
            return this.talkApi.getTalks(eventId);
        };
        TalksController.$inject = [
            "eventApi",
            "talkApi",
            "$routeParams"
        ];
        TalksController.talksCacheKey = "talks";
        return TalksController;
    }());
    Tccc.TalksController = TalksController;
    Tccc.App.controller("TalksController", TalksController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=TalksController.js.map