var Tccc;
(function (Tccc) {
    var TalksController = (function () {
        function TalksController(eventApi, talkApi, $sce, localStorageService) {
            var _this = this;
            this.eventApi = eventApi;
            this.talkApi = talkApi;
            this.$sce = $sce;
            this.localStorageService = localStorageService;
            this.talks = [];
            var cachedTalks = this.localStorageService.get(TalksController.talksCacheKey);
            if (cachedTalks) {
                this.talksLoaded(cachedTalks);
            }
            eventApi.getMostRecentEvent()
                .then(function (e) { return _this.eventLoaded(e); });
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
            this.localStorageService.set(TalksController.talksCacheKey, talks);
            this.talks = talks;
        };
        TalksController.$inject = ["eventApi", "talkApi", "$sce", "localStorageService"];
        TalksController.talksCacheKey = "talks";
        return TalksController;
    }());
    Tccc.TalksController = TalksController;
    Tccc.App.controller("TalksController", TalksController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=TalksController.js.map