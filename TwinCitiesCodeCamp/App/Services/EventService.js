var Tccc;
(function (Tccc) {
    var EventService = /** @class */ (function () {
        function EventService(apiService, localStorageService, $q) {
            this.apiService = apiService;
            this.localStorageService = localStorageService;
            this.$q = $q;
        }
        EventService.prototype.getMostRecentEvent = function () {
            var _this = this;
            var selector = function (e) { return new Tccc.Event(e); };
            var deferred = this.$q.defer();
            // See if we have the most recent event cache.
            var cachedMostRecentEvent = this.localStorageService.get(EventService.mostRecentEventCacheKey);
            if (cachedMostRecentEvent) {
                deferred.notify(new Tccc.Event(cachedMostRecentEvent));
            }
            // Fetch the most recent 
            this.apiService.query("/events/mostrecent", null, selector)
                .then(function (result) {
                deferred.resolve(result);
                _this.localStorageService.set(EventService.mostRecentEventCacheKey, result);
            })
                .catch(function (error) { return deferred.reject(error); });
            return deferred.promise;
        };
        EventService.prototype.getEvent = function (eventId) {
            var args = { eventId: eventId };
            var selector = function (e) { return new Tccc.Event(e); };
            return this.apiService.query("/events/get", args, selector);
        };
        EventService.prototype.getAll = function (descending) {
            if (descending === void 0) { descending = false; }
            var args = {
                descending: descending
            };
            var selector = function (events) { return events.map(function (e) { return new Tccc.Event(e); }); };
            return this.apiService.query("/events/getall", args, selector);
        };
        EventService.prototype.save = function (event) {
            return this.apiService.post("/events/save", event, function (e) { return new Tccc.Event(e); });
        };
        EventService.$inject = [
            "apiService",
            "localStorageService",
            "$q"
        ];
        EventService.mostRecentEventCacheKey = "mostRecentEvent";
        return EventService;
    }());
    Tccc.EventService = EventService;
    Tccc.App.service("eventApi", EventService);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=EventService.js.map