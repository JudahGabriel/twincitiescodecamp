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
            private $routeParams: ng.route.IRouteParamsService) {
            
            this.eventId = $routeParams["eventId"];
            const talksCacheKey = TalksController.talksCacheKey + this.eventId;
            this.talks = new List<Talk>(() => this.fetchTalks(`Events/${this.eventId}`), talksCacheKey);            
        }

        get friendlyLastSubmissionDate(): string {
            if (this.event && this.event.noTalkSubmissionsAfter) {
                return moment(this.event.noTalkSubmissionsAfter).format("MMMM Do");
            }

            return "[submission end date coming soon]";
        }

        get callForSpeakersOpened(): boolean {
            const callForSpeakersStarted = !!this.event && this.event.isAcceptingTalkSubmissions;
            const callForSpakersEnded = !!this.event && !!this.event.noTalkSubmissionsAfter && new Date() > new Date(this.event.noTalkSubmissionsAfter);
            return callForSpeakersStarted && !callForSpakersEnded;
        }

        get callForSpeakersEndFriendlyDate(): string {
            if (!!this.event && !!this.event.noTalkSubmissionsAfter) {
                return moment(this.event.noTalkSubmissionsAfter).format("MMMM Do");
            }

            return "";
        }

        $onInit() {
            this.eventApi.getEvent(`events/${this.eventId}`)
                .then(loadedEvent => this.event = loadedEvent);
            this.talks.fetch();
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