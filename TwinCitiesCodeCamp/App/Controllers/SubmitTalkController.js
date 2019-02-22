var Tccc;
(function (Tccc) {
    var SubmitTalkController = /** @class */ (function () {
        function SubmitTalkController(isSignedIn, talkApi, currentUserId, isUserAdmin, $routeParams) {
            this.isSignedIn = isSignedIn;
            this.talkApi = talkApi;
            this.currentUserId = currentUserId;
            this.isUserAdmin = isUserAdmin;
            this.$routeParams = $routeParams;
            this.isSaving = false;
            this.submission = new Tccc.Talk({
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
                status: Tccc.TalkApproval.Pending,
                tags: []
            });
            this.submissionSuccessful = false;
            this.updateSuccessful = false;
            this.submissionError = "";
            this.tags = [];
            this.tagsInput = "";
            this.tagPlaceholder = "web, beginner, react";
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
        SubmitTalkController.prototype.$onInit = function () {
            var _this = this;
            // We can either be submitting a new talk, or updating an existing one.
            // If we're updating an existing one, load it now.
            var talkSubmissionId = this.$routeParams["talkId"];
            if (talkSubmissionId) {
                this.isSaving = true;
                this.talkApi.getSubmission("Talks/" + talkSubmissionId)
                    .then(function (result) {
                    // Client side authorize: make sure the user is permitted to edit this submission.
                    // We do server-side authorization on save.
                    var canEditSubmission = _this.isUserAdmin || _this.currentUserId === result.submittedByUserId;
                    if (canEditSubmission) {
                        _this.submission = result;
                        _this.tags = result.tags;
                    }
                })
                    .finally(function () { return _this.isSaving = false; });
            }
        };
        SubmitTalkController.prototype.tagsInputChanged = function () {
            var _this = this;
            // If the user typed a comma, add any existing tag
            if (this.tagsInput.includes(",")) {
                var tags = this.tagsInput.split(",");
                this.tagsInput = "";
                tags.filter(function (t) { return t && t.length > 1; }).forEach(function (t) { return _this.addTag(t); });
            }
        };
        SubmitTalkController.prototype.searchTags = function (search) {
            return this.talkApi.searchTags(search);
        };
        SubmitTalkController.prototype.removeTag = function (tag) {
            var tagIndex = this.tags.indexOf(tag);
            if (tagIndex >= 0) {
                this.tags.splice(tagIndex, 1);
            }
        };
        SubmitTalkController.prototype.autoCompleteTagSelected = function (tag) {
            this.addTag(tag);
            this.tagsInput = "";
        };
        SubmitTalkController.prototype.addTag = function (tag) {
            var tagLowered = tag.toLowerCase().trim();
            if (!this.tags.includes(tagLowered) && tagLowered.length > 1) {
                this.tags.push(tagLowered);
                this.tagPlaceholder = "";
            }
        };
        SubmitTalkController.prototype.tagsEnterKeyPressed = function () {
            if (this.tagsInput.length > 1) {
                this.autoCompleteTagSelected(this.tagsInput);
            }
        };
        SubmitTalkController.prototype.save = function () {
            var _this = this;
            if (!this.isSaving && this.isValid) {
                this.submissionSuccessful = false;
                this.updateSuccessful = false;
                this.submissionError = "";
                this.isSaving = true;
                this.submission.tags = this.tags;
                var shouldCreateNew_1 = !this.submission.id;
                var saveTask = shouldCreateNew_1 ?
                    function () { return _this.talkApi.submitTalk(_this.submission); } :
                    function () { return _this.talkApi.updateTalk(_this.submission); };
                saveTask()
                    .then(function (updatedSubmission) {
                    _this.submissionSuccessful = shouldCreateNew_1;
                    _this.updateSuccessful = !shouldCreateNew_1;
                    _this.submission = updatedSubmission;
                })
                    .catch(function (error) { return _this.submissionError = JSON.stringify(error); })
                    .finally(function () { return _this.isSaving = false; });
            }
        };
        SubmitTalkController.$inject = [
            "isSignedIn",
            "talkApi",
            "currentUserId",
            "isUserAdmin",
            "$routeParams"
        ];
        return SubmitTalkController;
    }());
    Tccc.SubmitTalkController = SubmitTalkController;
    Tccc.App.controller("SubmitTalkController", SubmitTalkController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=SubmitTalkController.js.map