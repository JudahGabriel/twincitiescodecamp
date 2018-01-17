var Tccc;
(function (Tccc) {
    var PastEventDetailsController = /** @class */ (function () {
        function PastEventDetailsController(talkApi, eventApi, $routeParams) {
            this.talkApi = talkApi;
            this.eventApi = eventApi;
            this.$routeParams = $routeParams;
            this.talks = [];
        }
        PastEventDetailsController.prototype.$onInit = function () {
            var _this = this;
            var rawId = this.$routeParams["id"];
            var eventId = "Events/" + rawId;
            this.talkApi.getTalks(eventId).then(function (results) { return _this.talks = results; });
            this.eventApi.getEvent(eventId).then(function (results) { return _this.event = results; });
        };
        PastEventDetailsController.$inject = ["talkApi", "eventApi", "$routeParams"];
        return PastEventDetailsController;
    }());
    Tccc.PastEventDetailsController = PastEventDetailsController;
    Tccc.App.controller("PastEventDetailsController", PastEventDetailsController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=PastEventDetailsController.js.map