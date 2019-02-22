namespace Tccc {
    export class MyTalksController {
        submissions = new List<Talk>(() => this.getMySubmissions());

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

        getFriendlyEventName(submission: Talk) {
            const eventIdPrefix = "events/";
            if (submission.eventId && submission.eventId.length > eventIdPrefix.length) {
                return "#tccc" + submission.eventId.substring(eventIdPrefix.length);
            }

            return "Twin Cities Code Camp";
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