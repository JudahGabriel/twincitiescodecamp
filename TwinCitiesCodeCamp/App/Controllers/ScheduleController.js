var Tccc;
(function (Tccc) {
    var ScheduleController = (function () {
        function ScheduleController(eventApi, scheduleApi) {
            var _this = this;
            this.eventApi = eventApi;
            this.scheduleApi = scheduleApi;
            this.event = null;
            eventApi.getMostRecentEvent()
                .then(function (e) {
                _this.event = e;
                scheduleApi.getScheduleForEvent(e.id)
                    .then(function (s) { return _this.scheduleLoaded(s); });
            });
        }
        ScheduleController.prototype.scheduleLoaded = function (schedule) {
            this.schedule = schedule;
            this.schedule.timeslots.sort(function (a, b) { return a.start > b.start ? 1 : a.start < b.start ? -1 : 0; });
        };
        ScheduleController.$inject = ["eventApi", "scheduleApi"];
        return ScheduleController;
    })();
    Tccc.ScheduleController = ScheduleController;
    Tccc.App.controller("ScheduleController", ScheduleController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=ScheduleController.js.map