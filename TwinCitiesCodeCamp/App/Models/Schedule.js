var Tccc;
(function (Tccc) {
    var Schedule = (function () {
        function Schedule(serverObj) {
            angular.copy(serverObj, this);
            this.timeslots = serverObj.timeslots.map(function (s) { return new Tccc.ScheduleTimeslot(s); });
        }
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
        return Schedule;
    }());
    Tccc.Schedule = Schedule;
})(Tccc || (Tccc = {}));
