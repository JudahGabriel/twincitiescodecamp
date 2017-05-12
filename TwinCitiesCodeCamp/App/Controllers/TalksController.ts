namespace Tccc {
    export class TalksController {
        talks: List<Talk>;
        event: Event | null;
        eventId: string;

        static $inject = [
            "eventApi",
            "talkApi",
            "$routeParams"
        ];
        static talksCacheKey = "talks";

        constructor(
            private eventApi: EventService,
            private talkApi: TalkService,
            $routeParams: ng.route.IRouteParamsService) {
            
            this.eventId = $routeParams["eventId"];
            const talksCacheKey = TalksController.talksCacheKey + this.eventId;
            this.talks = new List<Talk>(() => this.fetchTalks(`Events/${this.eventId}`), talksCacheKey);
            this.talks.fetch();

            eventApi.getEvent(`Events/${this.eventId}`)
                .then(loadedEvent => this.event = loadedEvent);
        }

        fetchTalks(eventId: string): ng.IPromise<Talk[]> {
            return this.talkApi.getTalks(eventId);
        }

        //talksLoaded(talks: Talk[]) {
        //    //talks.forEach(t => t.htmlSafeAbstract = this.$sce.trustAsHtml(t.abstract));
        //    this.talks = talks;
        //    this.localStorageService.set(TalksController.talksCacheKey + this.eventId, talks);
        //}
    }

    App.controller("TalksController", TalksController);
}