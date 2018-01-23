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