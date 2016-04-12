var Tccc;
(function (Tccc) {
    var PastEventsController = (function () {
        function PastEventsController(eventApi) {
            var _this = this;
            this.eventApi = eventApi;
            this.allEvents = [];
            eventApi.getAll()
                .then(function (events) { return _this.allEvents = events; });
        }
        PastEventsController.$inject = ["eventApi"];
        return PastEventsController;
    }());
    Tccc.PastEventsController = PastEventsController;
    Tccc.App.controller("PastEventsController", PastEventsController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=PastEventsController.js.map