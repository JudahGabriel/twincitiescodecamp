var Tccc;
(function (Tccc) {
    var Schedule = /** @class */ (function () {
        function Schedule(serverObj) {
            this.isSaving = false;
            angular.copy(serverObj, this);
            this.timeslots = serverObj.timeslots.map(function (s) { return new Tccc.ScheduleTimeslot(s); });
        }
        Object.defineProperty(Schedule.prototype, "friendlyName", {
            get: function () {
                if (this.eventId && this.eventId.includes("/")) {
                    return "Schedule for #tccc" + this.eventId.substr(this.eventId.indexOf("/") + 1);
                }
                return "[untitled schedule]";
            },
            enumerable: true,
            configurable: true
        });
        Schedule.prototype.getRooms = function () {
            var rooms = [];
            this.timeslots.forEach(function (t) {
                t.items.forEach(function (i) {
                    if (i.room && !rooms.includes(i.room)) {
                        rooms.push(i.room);
                    }
                });
            });
            rooms.sort();
            return rooms;
        };
        Schedule.empty = function () {
            return new Schedule({
                eventId: "",
                id: null,
                timeslots: []
            });
        };
        return Schedule;
    }());
    Tccc.Schedule = Schedule;
})(Tccc || (Tccc = {}));
//# sourceMappingURL=Schedule.js.map