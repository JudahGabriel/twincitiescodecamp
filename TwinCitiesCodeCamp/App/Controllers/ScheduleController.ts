namespace Tccc {
    export class ScheduleController {
        
        event: Server.Event = null;
        schedule: Server.Schedule;

        static $inject = [
            "eventApi",
            "scheduleApi",
            "localStorageService"
        ];
        static scheduleCacheKey = "schedule";

        constructor(
            private eventApi: EventService,
            private scheduleApi: ScheduleService,
            private localStorageService: ng.local.storage.ILocalStorageService) {

            var cachedSchedule = localStorageService.get<Server.Schedule>(ScheduleController.scheduleCacheKey);
            if (cachedSchedule) {
                this.scheduleLoaded(cachedSchedule);
            }

            eventApi.getMostRecentEvent()
                .then(e => {
                    this.event = e;
                    scheduleApi.getScheduleForEvent(e.id)
                        .then(s => this.scheduleLoaded(s));
                });
        }

        scheduleLoaded(schedule: Server.Schedule) {
            this.schedule = schedule;
            this.schedule.timeslots.sort((a, b) => a.start > b.start ? 1 : a.start < b.start ? -1 : 0);
            this.schedule.timeslots.forEach(t => {
                t.items.sort((first, second) => first.room > second.room ? 1 : first.room < second.room ? -1 : 0);
            });
            this.localStorageService.set(ScheduleController.scheduleCacheKey, schedule);
        }

        print() {
            window.print();
        }
    }

    App.controller("ScheduleController", ScheduleController);
}