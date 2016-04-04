var Tccc;
(function (Tccc) {
    var Schedule = (function () {
        function Schedule(serverObj) {
            angular.copy(serverObj, this);
            this.timeslots = serverObj.timeslots.map(function (s) { return new Tccc.ScheduleTimeslot(s); });
        }
        return Schedule;
    }());
    Tccc.Schedule = Schedule;
})(Tccc || (Tccc = {}));
//# sourceMappingURL=Schedule.js.map