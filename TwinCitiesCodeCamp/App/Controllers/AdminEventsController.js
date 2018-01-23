var Tccc;
(function (Tccc) {
    var AdminEventsController = /** @class */ (function () {
        function AdminEventsController(eventApi) {
            this.eventApi = eventApi;
            this.selectedEvent = null;
            this.events = [];
        }
        AdminEventsController.prototype.$onInit = function () {
            var _this = this;
            this.eventApi.getAll(true)
                .then(function (results) {
                _this.events = results;
                _this.selectedEvent = _this.events[0];
            });
        };
        AdminEventsController.prototype.save = function () {
            var ev = this.selectedEvent;
            if (ev && !ev.isSaving) {
                ev.isSaving = true;
                this.eventApi.save(ev)
                    .finally(function () { return ev.isSaving = false; });
            }
        };
        AdminEventsController.$inject = [
            "eventApi"
        ];
        return AdminEventsController;
    }());
    Tccc.AdminEventsController = AdminEventsController;
    Tccc.App.controller("AdminEventsController", AdminEventsController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=AdminEventsController.js.map