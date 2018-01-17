var Tccc;
(function (Tccc) {
    var EventController = /** @class */ (function () {
        function EventController(eventApi) {
            this.eventApi = eventApi;
            this.event = null;
        }
        Object.defineProperty(EventController.prototype, "escapedAddress", {
            get: function () {
                return this.event ? encodeURIComponent(this.event.address) : "";
            },
            enumerable: true,
            configurable: true
        });
        EventController.prototype.$onInit = function () {
            var _this = this;
            this.eventApi.getMostRecentEvent()
                .then(function (e) { return _this.event = e; });
        };
        EventController.$inject = ["eventApi"];
        return EventController;
    }());
    Tccc.EventController = EventController;
    Tccc.App.controller("EventController", EventController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=EventController.js.map