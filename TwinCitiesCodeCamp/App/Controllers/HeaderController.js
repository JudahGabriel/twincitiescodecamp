var Tccc;
(function (Tccc) {
    var HeaderController = /** @class */ (function () {
        function HeaderController(eventApi, localStorageService) {
            this.eventApi = eventApi;
            this.localStorageService = localStorageService;
            this.event = null;
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
        Object.defineProperty(HeaderController.prototype, "registerUrl", {
            get: function () {
                if (this.event && this.event.registerUrl) {
                    return this.event.registerUrl;
                }
                return "#/register/notopened";
            },
            enumerable: true,
            configurable: true
        });
        HeaderController.prototype.$onInit = function () {
            var _this = this;
            this.eventApi.getMostRecentEvent()
                .then(function (e) { return _this.event = e; });
        };
        HeaderController.$inject = ["eventApi", "localStorageService"];
        return HeaderController;
    }());
    Tccc.HeaderController = HeaderController;
    Tccc.App.controller("HeaderController", HeaderController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=HeaderController.js.map