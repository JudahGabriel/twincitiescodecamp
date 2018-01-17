namespace Tccc {
    export class MyTalksController {
        submissions = new List<Server.TalkSubmission>(() => this.talkApi.getMySubmissions());

        static $inject = [
            "isSignedIn",
            "talkApi"
        ];

        constructor(
            private isSignedIn: boolean,
            private talkApi: TalkService) {
        }

        $onInit() {
            this.submissions.fetch();
        }
    }

    App.controller("MyTalksController", MyTalksController);
}