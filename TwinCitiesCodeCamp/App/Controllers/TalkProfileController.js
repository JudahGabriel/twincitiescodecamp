var Tccc;
(function (Tccc) {
    var TalkProfileController = (function () {
        function TalkProfileController(talkApi, $sce, $routeParams) {
            var _this = this;
            this.talkApi = talkApi;
            this.talk = null;
            var talkId = $routeParams["id"];
            talkApi.get("Talks/" + talkId).then(function (talk) {
                _this.talk = talk;
                _this.talk.htmlSafeAbstract = $sce.trustAsHtml(talk.abstract);
            });
        }
        TalkProfileController.$inject = ["talkApi", "$sce", "$routeParams"];
        return TalkProfileController;
    })();
    Tccc.TalkProfileController = TalkProfileController;
    Tccc.App.controller("TalkProfileController", TalkProfileController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=TalkProfileController.js.map