namespace Tccc {
    export class AdminNavController {
        page: "events" | "talks" | "sponsors" | "schedule";
        eventId: string | null;
        events = new List<Event>(() => this.eventApi.getAll(true), "admin-events");

        static $inject = [
            "eventApi"
        ];

        constructor(private eventApi: EventService) {
        }
        
        $onInit() {
            this.events.fetch();
        }

        getUrlForEvent(event: Event): string {
            return `#/admin/${event.id}/${this.page}`;
        }

        getEventNameFromId(id: string): string {
            var eventPrefixLength = 7; // 'events/'
            if (id && id.length > eventPrefixLength) {
                return "TCCC " + id.substr(eventPrefixLength);
            }

            return "";
        }

        isSelectedEvent(ev: Event): boolean {
            return ev.id === this.eventId;
        }
    }

    App.component("adminNav", {
        templateUrl: Partials.adminNav,
        controller: AdminNavController,
        controllerAs: "vm",
        bindings: {
            page: AngularBindings.Text,
            eventId: AngularBindings.OneWay
        }
    });
}