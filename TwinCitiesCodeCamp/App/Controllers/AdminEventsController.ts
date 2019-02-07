namespace Tccc {
    export class AdminEventsController {
        selectedEvent: Event | null = null;
        events: Event[] = [];
        
        static $inject = [
            "eventApi"
        ];

        constructor(private eventApi: EventService) {
        }
        
        $onInit() {
            this.eventApi.getAll(true)
                .then(results => {
                    this.events = results;
                    this.selectedEvent = this.events[0];
                });
        }

        addEvent() {
            let event: Event;
            if (this.selectedEvent) {
                event = new Event({
                    address: this.selectedEvent.address,
                    dateTime: new Date().toISOString(),
                    id: "",
                    isAcceptingTalkSubmissions: false,
                    locationFriendlyName: this.selectedEvent.locationFriendlyName,
                    number: this.selectedEvent.number + 1,
                    registerUrl: "",
                    seasonYear: "",
                    noTalkSubmissionsAfter: this.selectedEvent.noTalkSubmissionsAfter
                });
            } else {
                event = new Event({
                    address: "",
                    dateTime: new Date().toISOString(),
                    id: "",
                    isAcceptingTalkSubmissions: false,
                    locationFriendlyName: "",
                    number: 0,
                    registerUrl: "",
                    seasonYear: "",
                    noTalkSubmissionsAfter: null
                });
            }

            this.events.unshift(event);
            this.selectedEvent = event;
        }

        save() {
            var ev = this.selectedEvent;
            if (ev && !ev.isSaving) {
                ev.isSaving = true;
                this.eventApi.save(ev)
                    .finally(() => ev!.isSaving = false);
            }
        }
    }

    App.controller("AdminEventsController", AdminEventsController);
}