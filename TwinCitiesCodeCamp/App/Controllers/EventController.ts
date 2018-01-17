namespace Tccc {
    export class EventController {
        event: Server.Event | null = null;

        static $inject = ["eventApi"];

        constructor(private eventApi: EventService) {
        }

        get escapedAddress(): string {
            return this.event ? encodeURIComponent(this.event.address) : "";
        }

        $onInit() {
            this.eventApi.getMostRecentEvent()
                .then(e => this.event = e);
        }
    }

    App.controller("EventController", EventController);
}