var Tccc;
(function (Tccc) {
    var ScheduleController = (function () {
        function ScheduleController(eventApi, scheduleApi, talkApi, localStorageService) {
            var _this = this;
            this.eventApi = eventApi;
            this.scheduleApi = scheduleApi;
            this.talkApi = talkApi;
            this.localStorageService = localStorageService;
            this.event = null;
            this.talks = new Tccc.List(function () { return _this.fetchTalks(); }, "talks");
            this.talkIdImageUrls = {};
            var cachedSchedule = localStorageService.get(ScheduleController.scheduleCacheKey);
            if (cachedSchedule) {
                this.scheduleLoaded(cachedSchedule);
            }
            eventApi.getMostRecentEvent()
                .then(function (e) {
                _this.event = e;
                _this.talks.fetch();
                scheduleApi.getScheduleForEvent(e.id)
                    .then(function (s) { return _this.scheduleLoaded(s); });
            });
        }
        ScheduleController.prototype.fetchTalks = function () {
            if (!this.event) {
                throw new Error("Event must be fetched first.");
            }
            return this.talkApi.getTalks(this.event.id);
        };
        ScheduleController.prototype.scheduleLoaded = function (schedule) {
            this.schedule = schedule;
            this.schedule.timeslots.sort(function (a, b) { return a.start > b.start ? 1 : a.start < b.start ? -1 : 0; });
            this.schedule.timeslots.forEach(function (t) {
                t.items.sort(function (first, second) { return first.room > second.room ? 1 : first.room < second.room ? -1 : 0; });
            });
            this.localStorageService.set(ScheduleController.scheduleCacheKey, schedule);
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
        return ScheduleController;
    }());
    ScheduleController.$inject = [
        "eventApi",
        "scheduleApi",
        "talkApi",
        "localStorageService"
    ];
    ScheduleController.scheduleCacheKey = "schedule";
    Tccc.ScheduleController = ScheduleController;
    Tccc.App.controller("ScheduleController", ScheduleController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=ScheduleController.js.map