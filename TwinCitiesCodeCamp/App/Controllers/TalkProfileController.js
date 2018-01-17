var Tccc;
(function (Tccc) {
    var TalkProfileController = /** @class */ (function () {
        function TalkProfileController(talkApi, $sce, $routeParams) {
            this.talkApi = talkApi;
            this.$sce = $sce;
            this.$routeParams = $routeParams;
            this.talk = null;
        }
        TalkProfileController.prototype.$onInit = function () {
            var _this = this;
            var talkId = this.$routeParams["id"];
            this.talkApi.get("Talks/" + talkId).then(function (talk) {
                _this.talk = talk;
                _this.talk.htmlSafeAbstract = _this.$sce.trustAsHtml(talk.abstract);
                _this.talk.htmlSafeBio = _this.$sce.trustAsHtml(talk.authorBio);
            });
        };
        TalkProfileController.$inject = ["talkApi", "$sce", "$routeParams"];
        return TalkProfileController;
    }());
    Tccc.TalkProfileController = TalkProfileController;
    Tccc.App.controller("TalkProfileController", TalkProfileController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=TalkProfileController.js.map