namespace Tccc {
    export class EventController {
        event: Server.Event = null;

        static $inject = ["eventApi"];

        constructor(private eventApi: EventService) {
            eventApi.getMostRecentEvent()
                .then(e => this.event = e);
        }

        get escapedAddress(): string {
            return this.event ? encodeURIComponent(this.event.address) : "";
        }
    }

    App.controller("EventController", EventController);
}