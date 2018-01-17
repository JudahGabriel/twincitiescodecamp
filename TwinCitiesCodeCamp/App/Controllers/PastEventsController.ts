namespace Tccc {
    export class PastEventsController {
        allEvents: Event[] = [];

        static $inject = ["eventApi"];

        constructor(private eventApi: EventService) {
            
        }

        $onInit() {
            this.eventApi.getAll()
                .then(events => this.allEvents = events);
        }
    }

    App.controller("PastEventsController", PastEventsController);
}