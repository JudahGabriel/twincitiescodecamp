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
        return ScheduleService;
    }());
    ScheduleService.$inject = ["apiService"];
    Tccc.ScheduleService = ScheduleService;
    Tccc.App.service("scheduleApi", ScheduleService);
})(Tccc || (Tccc = {}));
