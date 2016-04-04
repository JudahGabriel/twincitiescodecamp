var Tccc;
(function (Tccc) {
    var ScheduleController = (function () {
        function ScheduleController(eventApi, scheduleApi, localStorageService) {
            var _this = this;
            this.eventApi = eventApi;
            this.scheduleApi = scheduleApi;
            this.localStorageService = localStorageService;
            this.event = null;
            var cachedSchedule = localStorageService.get(ScheduleController.scheduleCacheKey);
            if (cachedSchedule) {
                this.scheduleLoaded(cachedSchedule);
            }
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
        ScheduleController.$inject = ["eventApi", "scheduleApi", "localStorageService"];
        ScheduleController.scheduleCacheKey = "schedule";
        return ScheduleController;
    }());
    Tccc.ScheduleController = ScheduleController;
    Tccc.App.controller("ScheduleController", ScheduleController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=ScheduleController.js.map