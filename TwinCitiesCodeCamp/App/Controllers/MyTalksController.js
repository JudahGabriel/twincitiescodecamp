var Tccc;
(function (Tccc) {
    var MyTalksController = /** @class */ (function () {
        function MyTalksController(isSignedIn, talkApi, $sce) {
            var _this = this;
            this.isSignedIn = isSignedIn;
            this.talkApi = talkApi;
            this.$sce = $sce;
            this.submissions = new Tccc.List(function () { return _this.getMySubmissions(); });
        }
        MyTalksController.prototype.getFriendlyEventName = function (submission) {
            var eventIdPrefix = "events/";
            if (submission.eventId && submission.eventId.length > eventIdPrefix.length) {
                return "#tccc" + submission.eventId.substring(eventIdPrefix.length);
            }
            return "Twin Cities Code Camp";
        };
        MyTalksController.prototype.$onInit = function () {
            this.submissions.fetch();
        };
        MyTalksController.prototype.getMySubmissions = function () {
            var _this = this;
            var fetchTask = this.talkApi.getMySubmissions();
            return fetchTask
                .then(function (results) {
                results.forEach(function (submission) { return _this.$sce.trustAsHtml(submission.abstract); });
                return results;
            });
        };
        MyTalksController.$inject = [
            "isSignedIn",
            "talkApi",
            "$sce"
        ];
        return MyTalksController;
    }());
    Tccc.MyTalksController = MyTalksController;
    Tccc.App.controller("MyTalksController", MyTalksController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=MyTalksController.js.map