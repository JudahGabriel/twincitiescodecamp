namespace Tccc {
    export class HeaderController {
        event: Server.Event | null = null;

        static eventCacheKey = "mostRecentEvent";
        static $inject = ["eventApi", "localStorageService"];

        constructor(
            eventApi: EventService,
            private localStorageService: ng.local.storage.ILocalStorageService) {

            eventApi.getMostRecentEvent()
                .then(e => this.event = e);

            // Grab it from the cache if we've got it.
            var cachedEvent = localStorageService.get<Event>(HeaderController.eventCacheKey);
            if (cachedEvent) {
                this.event = cachedEvent;
            }

            // Load it fresh from the server in case it's been updated.
            eventApi.getMostRecentEvent()
                .then(e => this.loadedMostRecentEvent(e));
        }

        get eventDateFriendly(): string {
            if (this.event) {
                return moment(this.event.dateTime).format("MMMM Do, YYYY");
            }

            return "";
        }

        loadedMostRecentEvent(e: Server.Event) {
            this.event = e;
            this.localStorageService.set(HeaderController.eventCacheKey, e);
        }
    }

    App.controller("HeaderController", HeaderController);
}