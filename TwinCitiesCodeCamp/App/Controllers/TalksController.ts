namespace Tccc {
    export class TalksController {
        talks: Talk[] = [];
        event: Event;
        eventId: string;

        static $inject = ["eventApi", "talkApi", "$sce", "$routeParams", "localStorageService"];
        static talksCacheKey = "talks";

        constructor(
            private eventApi: EventService,
            private talkApi: TalkService,
            private $sce: ng.ISCEService,
            $routeParams: ng.route.IRouteParamsService,
            private localStorageService: ng.local.storage.ILocalStorageService) {
            
            this.eventId = $routeParams["eventId"];
            
            eventApi.getEvent(`Events/${this.eventId}`)
                .then(e => this.eventLoaded(e));

            var cachedTalks = this.localStorageService.get<Talk[]>(TalksController.talksCacheKey + this.eventId);
            if (cachedTalks) {
                this.talksLoaded(cachedTalks);
            }                
        }

        eventLoaded(e: Event) {
            this.event = e;
            this.talkApi.getTalks(e.id)
                .then(talks => this.talksLoaded(talks));
        }

        talksLoaded(talks: Talk[]) {
            talks.forEach(t => t.htmlSafeAbstract = this.$sce.trustAsHtml(t.abstract));
            this.talks = talks;
            this.localStorageService.set(TalksController.talksCacheKey + this.eventId, talks);
        }
    }

    App.controller("TalksController", TalksController);
}