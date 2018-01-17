var Tccc;
(function (Tccc) {
    var ScheduleController = /** @class */ (function () {
        function ScheduleController(eventApi, scheduleApi, talkApi, localStorageService) {
            var _this = this;
            this.eventApi = eventApi;
            this.scheduleApi = scheduleApi;
            this.talkApi = talkApi;
            this.localStorageService = localStorageService;
            this.event = null;
            this.schedule = null;
            this.talks = new Tccc.List(function () { return _this.fetchTalks(); }, "talks");
            this.talkIdImageUrls = {};
            this.hasAbsentSchedule = false;
        }
        ScheduleController.prototype.$onInit = function () {
            var _this = this;
            var cachedSchedule = this.localStorageService.get(ScheduleController.scheduleCacheKey);
            if (cachedSchedule) {
                this.scheduleLoaded(cachedSchedule);
            }
            this.eventApi.getMostRecentEvent()
                .then(function (e) {
                _this.event = e;
                _this.talks.fetch();
                _this.scheduleApi.getScheduleForEvent(e.id)
                    .then(function (s) { return _this.scheduleLoaded(s); });
            });
        };
        ScheduleController.prototype.fetchTalks = function () {
            if (!this.event) {
                throw new Error("Event must be fetched first.");
            }
            return this.talkApi.getTalks(this.event.id);
        };
        ScheduleController.prototype.scheduleLoaded = function (schedule) {
            this.schedule = schedule;
            this.hasAbsentSchedule = !schedule;
            if (this.schedule) {
                this.schedule.timeslots.sort(function (a, b) { return a.start > b.start ? 1 : a.start < b.start ? -1 : 0; });
                this.schedule.timeslots.forEach(function (t) {
                    t.items.sort(function (first, second) { return first.room > second.room ? 1 : first.room < second.room ? -1 : 0; });
                });
                this.localStorageService.set(ScheduleController.scheduleCacheKey, schedule);
            }
        };
        ScheduleController.prototype.print = function () {
            window.print();
        };
        ScheduleController.prototype.getImageForScheduleItem = function (item) {
            if (item.talkId) {
                var cached = this.talkIdImageUrls[item.talkId];
                if (cached) {
                    return cached;
                }
                var talk = this.talks.items.find(function (t) { return t.id == item.talkId; });
                if (talk) {
                    this.talkIdImageUrls[item.talkId] = talk.pictureUrl;
                    return talk.pictureUrl;
                }
                else {
                    return "../Content/Images/unknown-speaker.jpg";
                }
            }
            return null;
        };
        ScheduleController.$inject = [
            "eventApi",
            "scheduleApi",
            "talkApi",
            "localStorageService"
        ];
        ScheduleController.scheduleCacheKey = "schedule";
        return ScheduleController;
    }());
    Tccc.ScheduleController = ScheduleController;
    Tccc.App.controller("ScheduleController", ScheduleController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=ScheduleController.js.map