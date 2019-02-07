namespace Tccc {
    export class HeaderController {
        event: Server.Event | null = null;
        
        static $inject = ["eventApi", "localStorageService"];

        constructor(
            private eventApi: EventService,
            private localStorageService: ng.local.storage.ILocalStorageService) {
            
        }

        get eventDateFriendly(): string {
            if (this.event) {
                return moment(this.event.dateTime).format("MMMM Do, YYYY");
            }

            return "";
        }

        get registerUrl(): string {
            if (this.event && this.event.registerUrl) {
                return this.event.registerUrl;
            }

            return "#/register/notopened";
        }

        $onInit() {
            this.eventApi.getMostRecentEvent()
                .then(e => this.event = e);
        }
    }

    App.controller("HeaderController", HeaderController);
}