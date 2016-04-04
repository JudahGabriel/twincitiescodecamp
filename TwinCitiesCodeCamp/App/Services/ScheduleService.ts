namespace Tccc {
    export class ScheduleService {

        static $inject = ["apiService"];

        constructor(private apiService: ApiService) {
        }

        getScheduleForEvent(eventId: string): ng.IPromise<Schedule> {
            var args = { eventId: eventId };
            var selector = (s: Server.Schedule) => new Schedule(s);
            return this.apiService.query("/schedules/getscheduleforevent", args, selector);
        }
    }

    App.service("scheduleApi", ScheduleService);
}