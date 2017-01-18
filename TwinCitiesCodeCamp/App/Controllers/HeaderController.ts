namespace Tccc {
    export class HeaderController {
        event: Server.Event | null = null;
        
        static $inject = ["eventApi", "localStorageService"];

        constructor(
            eventApi: EventService,
            private localStorageService: ng.local.storage.ILocalStorageService) {

            eventApi.getMostRecentEvent()
                .then(e => this.event = e);
        }

        get eventDateFriendly(): string {
            if (this.event) {
                return moment(this.event.dateTime).format("MMMM Do, YYYY");
            }

            return "";
        }
    }

    App.controller("HeaderController", HeaderController);
}