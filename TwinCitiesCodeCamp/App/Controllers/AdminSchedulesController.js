var Tccc;
(function (Tccc) {
    var AdminSchedulesController = /** @class */ (function () {
        function AdminSchedulesController(scheduleApi, talkApi) {
            this.scheduleApi = scheduleApi;
            this.talkApi = talkApi;
            this.schedules = [];
            this.selectedSchedule = null;
            this.talks = [];
        }
        AdminSchedulesController.prototype.$onInit = function () {
            var _this = this;
            this.scheduleApi.getAll()
                .then(function (results) {
                _this.schedules = results;
                _this.setSelectedSchedule(results[0]);
            });
        };
        AdminSchedulesController.prototype.addSchedule = function () {
            var newSched = Tccc.Schedule.empty();
            this.schedules.push(newSched);
            this.selectedSchedule = newSched;
        };
        AdminSchedulesController.prototype.setSelectedSchedule = function (schedule) {
            var _this = this;
            this.selectedSchedule = schedule;
            this.talks = [];
            if (schedule) {
                this.talkApi.getTalks(schedule.eventId)
                    .then(function (results) {
                    if (_this.selectedSchedule === schedule) {
                        _this.talks = results.sort(function (a, b) { return a.title.localeCompare(b.title); });
                    }
                });
            }
        };
        AdminSchedulesController.prototype.addTimeslot = function () {
            if (this.selectedSchedule) {
                this.selectedSchedule.timeslots.push(new Tccc.ScheduleTimeslot({
                    start: 0,
                    duration: 0,
                    items: []
                }));
            }
        };
        AdminSchedulesController.prototype.removeTimeslot = function (timeslot) {
            if (this.selectedSchedule) {
                _.pull(this.selectedSchedule.timeslots, timeslot);
            }
        };
        AdminSchedulesController.prototype.addTimeslotItem = function (timeslot) {
            timeslot.items.push(new Tccc.ScheduleItem({
                author: "",
                room: "",
                talkId: "",
                title: ""
            }));
        };
        AdminSchedulesController.prototype.removeTimeslotItem = function (item, timeslot) {
            _.pull(timeslot.items, item);
        };
        AdminSchedulesController.prototype.saveSchedule = function (schedule) {
            if (!schedule.isSaving) {
                schedule.isSaving = true;
                this.scheduleApi.save(schedule)
                    .then(function (result) { return angular.merge(schedule, result); })
                    .finally(function () { return schedule.isSaving = false; });
            }
        };
        AdminSchedulesController.prototype.talkSetForTimeslotItem = function (item) {
            if (item.talkId) {
                var talk = this.talks.find(function (t) { return t.id === item.talkId; });
                if (talk) {
                    item.title = talk.title;
                    item.author = talk.author;
                }
            }
        };
        AdminSchedulesController.$inject = [
            "scheduleApi",
            "talkApi"
        ];
        return AdminSchedulesController;
    }());
    Tccc.AdminSchedulesController = AdminSchedulesController;
    Tccc.App.controller("AdminSchedulesController", AdminSchedulesController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=AdminSchedulesController.js.map