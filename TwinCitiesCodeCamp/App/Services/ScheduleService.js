var Tccc;
(function (Tccc) {
    var ScheduleService = (function () {
        function ScheduleService(apiService) {
            this.apiService = apiService;
        }
        ScheduleService.prototype.getScheduleForEvent = function (eventId) {
            var args = { eventId: eventId };
            var selector = function (s) { return new Tccc.Schedule(s); };
            return this.apiService.query("/schedules/getscheduleforevent", args, selector);
        };
        ScheduleService.prototype.getAll = function () {
            var selector = function (results) { return results.map(function (r) { return new Tccc.Schedule(r); }); };
            return this.apiService.query("/schedules/getAll", null, selector);
        };
        ScheduleService.prototype.save = function (schedule) {
            var selector = function (s) { return new Tccc.Schedule(s); };
            return this.apiService.post("/schedules/save", schedule, selector);
        };
        return ScheduleService;
    }());
    ScheduleService.$inject = ["apiService"];
    Tccc.ScheduleService = ScheduleService;
    Tccc.App.service("scheduleApi", ScheduleService);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=ScheduleService.js.map