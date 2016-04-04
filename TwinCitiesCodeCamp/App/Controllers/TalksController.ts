namespace Tccc {
    export class TalksController {
        talks: Talk[] = [];
        event: Event;

        static $inject = ["eventApi", "talkApi", "$sce", "localStorageService"];
        static talksCacheKey = "talks";

        constructor(
            private eventApi: EventService,
            private talkApi: TalkService,
            private $sce: ng.ISCEService,
            private localStorageService: ng.local.storage.ILocalStorageService) {

            var cachedTalks = this.localStorageService.get<Talk[]>(TalksController.talksCacheKey);
            if (cachedTalks) {
                this.talksLoaded(cachedTalks);
            }

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
            this.localStorageService.set(TalksController.talksCacheKey, talks);
            this.talks = talks;
        }
    }

    App.controller("TalksController", TalksController);
}