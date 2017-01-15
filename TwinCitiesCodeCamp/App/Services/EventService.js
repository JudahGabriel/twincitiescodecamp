var Tccc;
(function (Tccc) {
    var EventService = (function () {
        function EventService(apiService) {
            this.apiService = apiService;
        }
        EventService.prototype.getMostRecentEvent = function () {
            var selector = function (e) { return new Tccc.Event(e); };
            return this.apiService.query("/events/mostrecent", null, selector);
        };
        EventService.prototype.getEvent = function (eventId) {
            var args = { eventId: eventId };
            var selector = function (e) { return new Tccc.Event(e); };
            return this.apiService.query("/events/get", args, selector);
        };
        EventService.prototype.getAll = function () {
            var selector = function (events) { return events.map(function (e) { return new Tccc.Event(e); }); };
            return this.apiService.query("/events/getall", null, selector);
        };
        return EventService;
    }());
    EventService.$inject = ["apiService"];
    Tccc.EventService = EventService;
    Tccc.App.service("eventApi", EventService);
})(Tccc || (Tccc = {}));
