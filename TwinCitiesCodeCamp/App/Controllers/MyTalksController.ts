namespace Tccc {
    export class MyTalksController {
        submissions = new List<Talk>(() => this.getMySubmissions());
        _submissionsByEventField: { eventId: string; talks: Talk[] }[] = [];

        static $inject = [
            "isSignedIn",
            "talkApi",
            "$sce"
        ];

        constructor(
            private readonly isSignedIn: boolean,
            private readonly talkApi: TalkService,
            private readonly $sce: ng.ISCEService) {
        }

        get submissionsByEvent(): { eventId: string; talks: Talk[] }[] {
            if (this._submissionsByEventField.length === 0 && this.submissions.isLoadedWithData) {
                const talksByEventId = _.groupBy(this.submissions.items, t => t.eventId);
                for (var eventId in talksByEventId) {
                    this._submissionsByEventField.push({
                        eventId: eventId,
                        talks: talksByEventId[eventId]
                    });
                }
            }
            
            return this._submissionsByEventField;
        }

        getFriendlyEventName(eventId: string) {
            const eventIdPrefix = "events/";
            if (eventId && eventId.length > eventIdPrefix.length) {
                return "#tccc" + eventId.substring(eventIdPrefix.length);
            }

            return "Twin Cities Code Camp";
        }

        getYearForTalk(talk: Talk | undefined | null) {
            return talk ? moment(talk.submissionDate).year() : new Date().getFullYear();
        }

        $onInit() {
            this.submissions.fetch();
        }

        getMySubmissions(): ng.IPromise<Talk[]> {
            const fetchTask = this.talkApi.getMySubmissions();
            return fetchTask
                .then(results => {
                    results.forEach(submission => this.$sce.trustAsHtml(submission.abstract));
                    return results;
                });
        }
    }

    App.controller("MyTalksController", MyTalksController);
}