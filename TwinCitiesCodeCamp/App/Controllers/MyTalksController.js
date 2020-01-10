var Tccc;
(function (Tccc) {
    var MyTalksController = /** @class */ (function () {
        function MyTalksController(isSignedIn, talkApi, $sce) {
            var _this = this;
            this.isSignedIn = isSignedIn;
            this.talkApi = talkApi;
            this.$sce = $sce;
            this.submissions = new Tccc.List(function () { return _this.getMySubmissions(); });
            this._submissionsByEventField = [];
        }
        Object.defineProperty(MyTalksController.prototype, "submissionsByEvent", {
            get: function () {
                if (this._submissionsByEventField.length === 0 && this.submissions.isLoadedWithData) {
                    var talksByEventId = _.groupBy(this.submissions.items, function (t) { return t.eventId; });
                    for (var eventId in talksByEventId) {
                        this._submissionsByEventField.push({
                            eventId: eventId,
                            talks: talksByEventId[eventId]
                        });
                    }
                }
                return this._submissionsByEventField;
            },
            enumerable: true,
            configurable: true
        });
        MyTalksController.prototype.getFriendlyEventName = function (eventId) {
            var eventIdPrefix = "events/";
            if (eventId && eventId.length > eventIdPrefix.length) {
                return "#tccc" + eventId.substring(eventIdPrefix.length);
            }
            return "Twin Cities Code Camp";
        };
        MyTalksController.prototype.getYearForTalk = function (talk) {
            return talk ? moment(talk.submissionDate).year() : new Date().getFullYear();
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