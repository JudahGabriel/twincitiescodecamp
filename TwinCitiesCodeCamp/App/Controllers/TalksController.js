var Tccc;
(function (Tccc) {
    var TalksController = (function () {
        function TalksController(eventApi, talkApi, $sce, $routeParams, localStorageService) {
            var _this = this;
            this.eventApi = eventApi;
            this.talkApi = talkApi;
            this.$sce = $sce;
            this.localStorageService = localStorageService;
            this.talks = [];
            this.eventId = $routeParams["eventId"];
            eventApi.getEvent("Events/" + this.eventId)
                .then(function (e) { return _this.eventLoaded(e); });
            var cachedTalks = this.localStorageService.get(TalksController.talksCacheKey + this.eventId);
            if (cachedTalks) {
                this.talksLoaded(cachedTalks);
            }
        }
        TalksController.prototype.eventLoaded = function (e) {
            var _this = this;
            this.event = e;
            this.talkApi.getTalks(e.id)
                .then(function (talks) { return _this.talksLoaded(talks); });
        };
        TalksController.prototype.talksLoaded = function (talks) {
            var _this = this;
            talks.forEach(function (t) { return t.htmlSafeAbstract = _this.$sce.trustAsHtml(t.abstract); });
            this.talks = talks;
            this.localStorageService.set(TalksController.talksCacheKey + this.eventId, talks);
        };
        return TalksController;
    }());
    TalksController.$inject = [
        "eventApi",
        "talkApi",
        "$sce",
        "$routeParams",
        "localStorageService"
    ];
    TalksController.talksCacheKey = "talks";
    Tccc.TalksController = TalksController;
    Tccc.App.controller("TalksController", TalksController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=TalksController.js.map