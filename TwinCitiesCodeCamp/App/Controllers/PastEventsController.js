var Tccc;
(function (Tccc) {
    var PastEventsController = /** @class */ (function () {
        function PastEventsController(eventApi) {
            this.eventApi = eventApi;
            this.allEvents = [];
        }
        PastEventsController.prototype.$onInit = function () {
            var _this = this;
            this.eventApi.getAll()
                .then(function (events) { return _this.allEvents = events; });
        };
        PastEventsController.$inject = ["eventApi"];
        return PastEventsController;
    }());
    Tccc.PastEventsController = PastEventsController;
    Tccc.App.controller("PastEventsController", PastEventsController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=PastEventsController.js.map