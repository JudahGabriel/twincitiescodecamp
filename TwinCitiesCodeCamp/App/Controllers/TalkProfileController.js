var Tccc;
(function (Tccc) {
    var TalkProfileController = /** @class */ (function () {
        function TalkProfileController(talkApi, currentUserId, $sce, $routeParams) {
            this.talkApi = talkApi;
            this.currentUserId = currentUserId;
            this.$sce = $sce;
            this.$routeParams = $routeParams;
            this.talk = null;
        }
        Object.defineProperty(TalkProfileController.prototype, "canEditTalk", {
            get: function () {
                if (this.talk) {
                    return this.talk.submittedByUserId === this.currentUserId && !!this.currentUserId;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        TalkProfileController.prototype.$onInit = function () {
            var _this = this;
            var talkId = this.$routeParams["id"];
            if (talkId) {
                this.talkApi.get("Talks/" + talkId)
                    .then(function (talk) { return _this.processTalk(talk); });
            }
        };
        TalkProfileController.prototype.processTalk = function (talk) {
            this.talk = talk;
            this.talk.htmlSafeAbstract = this.$sce.trustAsHtml(talk.abstract);
            this.talk.htmlSafeBio = this.$sce.trustAsHtml(talk.authorBio);
        };
        TalkProfileController.$inject = [
            "talkApi",
            "currentUserId",
            "$sce",
            "$routeParams"
        ];
        return TalkProfileController;
    }());
    Tccc.TalkProfileController = TalkProfileController;
    Tccc.App.controller("TalkProfileController", TalkProfileController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=TalkProfileController.js.map