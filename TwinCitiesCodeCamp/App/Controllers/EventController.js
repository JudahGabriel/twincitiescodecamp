var Tccc;
(function (Tccc) {
    var EventController = (function () {
        function EventController(eventApi) {
            var _this = this;
            this.eventApi = eventApi;
            this.event = null;
            eventApi.getMostRecentEvent()
                .then(function (e) { return _this.event = e; });
        }
        Object.defineProperty(EventController.prototype, "escapedAddress", {
            get: function () {
                return this.event ? encodeURIComponent(this.event.address) : "";
            },
            enumerable: true,
            configurable: true
        });
        EventController.$inject = ["eventApi"];
        return EventController;
    }());
    Tccc.EventController = EventController;
    Tccc.App.controller("EventController", EventController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=EventController.js.map