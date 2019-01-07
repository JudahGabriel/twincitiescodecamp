namespace Tccc {
    export class MyTalksController {
        submissions = new List<Server.TalkSubmission>(() => this.getMySubmissions());

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

        getFriendlyEventName(submission: Server.TalkSubmission) {
            const eventIdPrefix = "events/";
            if (submission.eventId && submission.eventId.length > eventIdPrefix.length) {
                return "TCC " + submission.eventId.substring(eventIdPrefix.length);
            }

            return "Twin Cities Code Camp";
        }

        $onInit() {
            this.submissions.fetch();
        }

        getMySubmissions(): ng.IPromise<Server.TalkSubmission[]> {
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