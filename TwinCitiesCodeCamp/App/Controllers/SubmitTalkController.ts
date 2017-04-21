namespace Tccc {
    export class SubmitTalkController {

        isSaving = false;
        submission: Server.TalkSubmission = {
            abstract: "",
            authorBio: "",
            authorGitHub: "",
            author: "",
            authorTwitter: "",
            eventId: "",
            hour: 0,
            id: "",
            pictureUrl: "",
            room: "",
            submissionDate: "",
            submittedByUserId: "",
            title: "",
            status: TalkApproval.Pending
        };
        submissionSuccessful = false;
        submissionError = "";

        static $inject = [
            "isSignedIn",
            "talkApi",
            "eventApi"
        ];

        constructor(
            private isSignedIn: boolean,
            private talkApi: TalkService) {
        }

        get isValid() {
            return !!this.submission.author &&
                this.submission.title &&
                this.submission.abstract &&
                this.submission.authorBio;
        }

        save() {
            if (!this.isSaving && this.isValid) {
                this.submissionSuccessful = false;
                this.submissionError = "";
                this.isSaving = true;
                this.talkApi.submitTalk(this.submission)
                    .then(() => this.submissionSuccessful = true)
                    .catch(error => this.submissionError = JSON.stringify(error))
                    .finally(() => this.isSaving = false);
            }
        }
    }

    App.controller("SubmitTalkController", SubmitTalkController);
}