namespace Tccc {
    export class PastEventsController {
        allEvents: Event[] = [];

        static $inject = ["eventApi"];

        constructor(private eventApi: EventService) {
            eventApi.getAll()
                .then(events => this.allEvents = events);
        }
    }

    App.controller("PastEventsController", PastEventsController);
}