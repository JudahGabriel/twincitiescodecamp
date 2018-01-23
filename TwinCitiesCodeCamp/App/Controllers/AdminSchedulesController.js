var Tccc;
(function (Tccc) {
    var AdminSchedulesController = /** @class */ (function () {
        function AdminSchedulesController(scheduleApi, talkApi, $routeParams) {
            this.scheduleApi = scheduleApi;
            this.talkApi = talkApi;
            this.$routeParams = $routeParams;
            this.hasLoadedSchedule = false;
            this.talks = [];
            var eventNumber = $routeParams["eventNumber"];
            this.eventId = "events/" + eventNumber;
        }
        Object.defineProperty(AdminSchedulesController.prototype, "canAddSchedule", {
            get: function () {
                return this.hasLoadedSchedule && !this.schedule;
            },
            enumerable: true,
            configurable: true
        });
        AdminSchedulesController.prototype.$onInit = function () {
            var _this = this;
            this.loadTalksForEvent();
            this.scheduleApi.getScheduleForEvent(this.eventId)
                .then(function (result) {
                _this.hasLoadedSchedule = true;
                _this.schedule = result;
            });
        };
        AdminSchedulesController.prototype.addSchedule = function () {
            if (this.hasLoadedSchedule && !this.schedule) {
                var newSched = Tccc.Schedule.empty();
                newSched.eventId = this.eventId;
                this.schedule = newSched;
                this.loadTalksForEvent();
            }
        };
        AdminSchedulesController.prototype.loadTalksForEvent = function () {
            var _this = this;
            this.talkApi.getTalks(this.eventId)
                .then(function (results) { return _this.talks = results.sort(function (a, b) { return a.title.localeCompare(b.title); }); });
        };
        AdminSchedulesController.prototype.addTimeslot = function () {
            if (this.schedule) {
                this.schedule.timeslots.push(new Tccc.ScheduleTimeslot({
                    start: 0,
                    duration: 0,
                    items: []
                }));
            }
        };
        AdminSchedulesController.prototype.removeTimeslot = function (timeslot) {
            if (this.schedule) {
                _.pull(this.schedule.timeslots, timeslot);
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
        AdminSchedulesController.prototype.saveSchedule = function () {
            var _this = this;
            if (this.schedule && !this.schedule.isSaving) {
                this.schedule.isSaving = true;
                this.scheduleApi.save(this.schedule)
                    .then(function (result) { return angular.merge(_this.schedule, result); })
                    .finally(function () { return _this.schedule.isSaving = false; });
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
            "talkApi",
            "$routeParams"
        ];
        return AdminSchedulesController;
    }());
    Tccc.AdminSchedulesController = AdminSchedulesController;
    Tccc.App.controller("AdminSchedulesController", AdminSchedulesController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=AdminSchedulesController.js.map