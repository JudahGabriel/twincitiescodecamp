namespace Tccc {
    export class AdminSubmissionsController {
        
        submissions: Server.TalkSubmission[] = [];
        currentTalk: Server.TalkSubmission | null = null;

        static $inject = [
            "isUserAdmin",
            "talkApi"
        ];

        constructor(
            isUserAdmin: boolean,
            talkApi: TalkService) {

            if (!isUserAdmin) {
                window.location.href = "/account/login";
            }

            talkApi.getSubmissions()
                .then(results => {
                    this.submissions = results;
                    this.currentTalk = results[0];
                });
        }        

        get currentTalkEmail(): string {
            return this.currentTalk && this.currentTalk.submittedByUserId ?
                this.currentTalk.submittedByUserId.replace("ApplicationUsers/", "") : "";
        }
    }

    App.controller("AdminSubmissionsController", AdminSubmissionsController);
}