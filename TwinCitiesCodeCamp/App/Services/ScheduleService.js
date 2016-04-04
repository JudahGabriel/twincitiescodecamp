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
        ScheduleService.$inject = ["apiService"];
        return ScheduleService;
    }());
    Tccc.ScheduleService = ScheduleService;
    Tccc.App.service("scheduleApi", ScheduleService);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=ScheduleService.js.map