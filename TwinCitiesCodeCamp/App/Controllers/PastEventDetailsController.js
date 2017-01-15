var Tccc;
(function (Tccc) {
    var PastEventDetailsController = (function () {
        function PastEventDetailsController(talkApi, eventApi, $routeParams) {
            var _this = this;
            this.talks = [];
            var rawId = $routeParams["id"];
            var eventId = "Events/" + rawId;
            talkApi.getTalks(eventId).then(function (results) { return _this.talks = results; });
            eventApi.getEvent(eventId).then(function (results) { return _this.event = results; });
        }
        return PastEventDetailsController;
    }());
    PastEventDetailsController.$inject = ["talkApi", "eventApi", "$routeParams"];
    Tccc.PastEventDetailsController = PastEventDetailsController;
    Tccc.App.controller("PastEventDetailsController", PastEventDetailsController);
})(Tccc || (Tccc = {}));
