var Tccc;
(function (Tccc) {
    var SessionsController = (function () {
        function SessionsController(eventApi, talkApi, $sce) {
            var _this = this;
            this.eventApi = eventApi;
            this.talkApi = talkApi;
            this.$sce = $sce;
            this.talks = [];
            eventApi.getMostRecentEvent()
                .then(function (e) { return _this.eventLoaded(e); });
        }
        SessionsController.prototype.eventLoaded = function (e) {
            var _this = this;
            this.event = e;
            this.talkApi.getTalks(e.id)
                .then(function (talks) { return _this.talksLoaded(talks); });
        };
        SessionsController.prototype.talksLoaded = function (talks) {
            var _this = this;
            talks.forEach(function (t) { return t.htmlSafeAbstract = _this.$sce.trustAsHtml(t.abstract); });
            this.talks = talks;
        };
        SessionsController.$inject = ["eventApi", "talkApi", "$sce"];
        return SessionsController;
    })();
    Tccc.SessionsController = SessionsController;
    Tccc.App.controller("SessionsController", SessionsController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=TalksController.js.map