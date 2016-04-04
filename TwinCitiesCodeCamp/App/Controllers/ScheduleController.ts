namespace Tccc {
    export class ScheduleController {

        static $inject = ["eventApi", "scheduleApi"];
        event: Server.Event = null;
        schedule: Server.Schedule;

        constructor(private eventApi: EventService, private scheduleApi: ScheduleService) {
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
        }
    }

    App.controller("ScheduleController", ScheduleController);
}