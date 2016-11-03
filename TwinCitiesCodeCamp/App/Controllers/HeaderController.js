var Tccc;
(function (Tccc) {
    var HeaderController = (function () {
        function HeaderController(eventApi, localStorageService) {
            var _this = this;
            this.localStorageService = localStorageService;
            this.event = null;
            eventApi.getMostRecentEvent()
                .then(function (e) { return _this.event = e; });
            // Grab it from the cache if we've got it.
            var cachedEvent = localStorageService.get(HeaderController.eventCacheKey);
            if (cachedEvent) {
                this.event = cachedEvent;
            }
            // Load it fresh from the server in case it's been updated.
            eventApi.getMostRecentEvent()
                .then(function (e) { return _this.loadedMostRecentEvent(e); });
        }
        Object.defineProperty(HeaderController.prototype, "eventDateFriendly", {
            get: function () {
                if (this.event) {
                    return moment(this.event.dateTime).format("MMMM Do, YYYY");
                }
                return "";
            },
            enumerable: true,
            configurable: true
        });
        HeaderController.prototype.loadedMostRecentEvent = function (e) {
            this.event = e;
            this.localStorageService.set(HeaderController.eventCacheKey, e);
        };
        HeaderController.eventCacheKey = "mostRecentEvent";
        HeaderController.$inject = ["eventApi", "localStorageService"];
        return HeaderController;
    }());
    Tccc.HeaderController = HeaderController;
    Tccc.App.controller("HeaderController", HeaderController);
})(Tccc || (Tccc = {}));
