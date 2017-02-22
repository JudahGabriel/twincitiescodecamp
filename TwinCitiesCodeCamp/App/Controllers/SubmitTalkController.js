var Tccc;
(function (Tccc) {
    var SubmitTalkController = (function () {
        function SubmitTalkController(isSignedIn, talkApi) {
            this.isSignedIn = isSignedIn;
            this.talkApi = talkApi;
            this.isSaving = false;
            this.submission = {
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
                status: Tccc.TalkApproval.Pending
            };
            this.submissionSuccessful = false;
            this.submissionError = "";
        }
        Object.defineProperty(SubmitTalkController.prototype, "isValid", {
            get: function () {
                return !!this.submission.author &&
                    this.submission.title &&
                    this.submission.abstract &&
                    this.submission.authorBio;
            },
            enumerable: true,
            configurable: true
        });
        SubmitTalkController.prototype.save = function () {
            var _this = this;
            if (!this.isSaving && this.isValid) {
                this.submissionSuccessful = false;
                this.submissionError = "";
                this.isSaving = true;
                this.talkApi.submitTalk(this.submission)
                    .then(function () { return _this.submissionSuccessful = true; })
                    .catch(function (error) { return _this.submissionError = JSON.stringify(error); })
                    .finally(function () { return _this.isSaving = false; });
            }
        };
        return SubmitTalkController;
    }());
    SubmitTalkController.$inject = [
        "isSignedIn",
        "talkApi"
    ];
    Tccc.SubmitTalkController = SubmitTalkController;
    Tccc.App.controller("SubmitTalkController", SubmitTalkController);
})(Tccc || (Tccc = {}));
