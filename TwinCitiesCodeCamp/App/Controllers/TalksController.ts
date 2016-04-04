namespace Tccc {
    export class SessionsController {
        talks: Talk[] = [];
        event: Event;

        static $inject = ["eventApi", "talkApi", "$sce"];

        constructor(
            private eventApi: EventService,
            private talkApi: TalkService,
            private $sce: ng.ISCEService) {

            eventApi.getMostRecentEvent()
                .then(e => this.eventLoaded(e));
        }

        eventLoaded(e: Event) {
            this.event = e;
            this.talkApi.getTalks(e.id)
                .then(talks => this.talksLoaded(talks));
        }

        talksLoaded(talks: Talk[]) {
            talks.forEach(t => t.htmlSafeAbstract = this.$sce.trustAsHtml(t.abstract));
            this.talks = talks;
        }
    }

    App.controller("SessionsController", SessionsController);
}