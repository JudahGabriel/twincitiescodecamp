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

        getAll(): ng.IPromise<Schedule[]> {
            var selector = (results: Server.Schedule[]) => results.map(r => new Schedule(r));
            return this.apiService.query("/schedules/getAll", null, selector);
        }

        save(schedule: Schedule): ng.IPromise<Schedule> {
            var selector = (s: Server.Schedule) => new Schedule(s);
            return this.apiService.post("/schedules/save", schedule, selector);
        }
    }

    App.service("scheduleApi", ScheduleService);
}