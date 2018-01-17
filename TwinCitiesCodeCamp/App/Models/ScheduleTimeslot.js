var Tccc;
(function (Tccc) {
    var ScheduleTimeslot = /** @class */ (function () {
        function ScheduleTimeslot(serverObj) {
            angular.copy(serverObj, this);
            this.items = serverObj.items.map(function (i) { return new Tccc.ScheduleItem(i); });
        }
        Object.defineProperty(ScheduleTimeslot.prototype, "startFriendly", {
            get: function () {
                return moment()
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .add(this.start, "hours")
                    .format("h:mm a");
            },
            enumerable: true,
            configurable: true
        });
        return ScheduleTimeslot;
    }());
    Tccc.ScheduleTimeslot = ScheduleTimeslot;
})(Tccc || (Tccc = {}));
//# sourceMappingURL=ScheduleTimeslot.js.map