var Tccc;
(function (Tccc) {
    var AdminNavController = /** @class */ (function () {
        function AdminNavController(eventApi) {
            var _this = this;
            this.eventApi = eventApi;
            this.events = new Tccc.List(function () { return _this.eventApi.getAll(true); }, "admin-events");
        }
        AdminNavController.prototype.$onInit = function () {
            this.events.fetch();
        };
        AdminNavController.prototype.getUrlForEvent = function (event) {
            return "#/admin/" + event.id + "/" + this.page;
        };
        AdminNavController.prototype.getEventNameFromId = function (id) {
            var eventPrefixLength = 7; // 'events/'
            if (id && id.length > eventPrefixLength) {
                return "TCCC " + id.substr(eventPrefixLength);
            }
            return "";
        };
        AdminNavController.prototype.isSelectedEvent = function (ev) {
            return ev.id === this.eventId;
        };
        AdminNavController.$inject = [
            "eventApi"
        ];
        return AdminNavController;
    }());
    Tccc.AdminNavController = AdminNavController;
    Tccc.App.component("adminNav", {
        templateUrl: Tccc.Partials.adminNav,
        controller: AdminNavController,
        controllerAs: "vm",
        bindings: {
            page: Tccc.AngularBindings.Text,
            eventId: Tccc.AngularBindings.OneWay
        }
    });
})(Tccc || (Tccc = {}));
//# sourceMappingURL=AdminNavController.js.map