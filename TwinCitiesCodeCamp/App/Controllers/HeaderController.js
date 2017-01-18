var Tccc;
(function (Tccc) {
    var HeaderController = (function () {
        function HeaderController(eventApi, localStorageService) {
            var _this = this;
            this.localStorageService = localStorageService;
            this.event = null;
            eventApi.getMostRecentEvent()
                .then(function (e) { return _this.event = e; });
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
        return HeaderController;
    }());
    HeaderController.$inject = ["eventApi", "localStorageService"];
    Tccc.HeaderController = HeaderController;
    Tccc.App.controller("HeaderController", HeaderController);
})(Tccc || (Tccc = {}));
