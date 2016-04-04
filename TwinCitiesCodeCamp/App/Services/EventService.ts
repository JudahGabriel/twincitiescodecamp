namespace Tccc {
    export class EventService {

        static $inject = ["apiService"];

        constructor(private apiService: ApiService) {
        }

        getMostRecentEvent(): ng.IPromise<Event> {
            var selector = (e: Server.Event) => new Event(e);
            return this.apiService.query("/events/mostrecent", null, selector);
        }

        getEvent(eventId: string): ng.IPromise<Event> {
            var args = { eventId: eventId };
            var selector = (e: Server.Event) => new Event(e);
            return this.apiService.query("/events/get", args, selector);
        }

        getAll(): ng.IPromise<Event[]> {
            var selector = (events: Server.Event[]) => events.map(e => new Event(e));
            return this.apiService.query("/events/getall", null, selector);
        }
    }

    App.service("eventApi", EventService);
}