namespace Tccc {
    export class SubmitTalkController {

        isSaving = false;
        submission = new Talk({
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
            status: TalkApproval.Pending,
            tags: []
        });
        submissionSuccessful = false;
        updateSuccessful = false;
        submissionError = "";
        tags: string[] = [];
        tagsInput = "";
        tagPlaceholder = "web, beginner, react";

        static $inject = [
            "isSignedIn",
            "talkApi",
            "currentUserId",
            "isUserAdmin",
            "$routeParams"
        ];

        constructor(
            private readonly isSignedIn: boolean,
            private readonly talkApi: TalkService,
            private readonly currentUserId: string,
            private readonly isUserAdmin: string,
            private readonly $routeParams: ng.route.IRouteParamsService) {
        }

        get isValid() {
            return !!this.submission.author &&
                this.submission.title &&
                this.submission.abstract &&
                this.submission.authorBio;
        }

        $onInit() {
            // We can either be submitting a new talk, or updating an existing one.
            // If we're updating an existing one, load it now.
            const talkSubmissionId: string | null = this.$routeParams["talkId"];
            if (talkSubmissionId) {
                this.isSaving = true;
                this.talkApi.getSubmission("Talks/" + talkSubmissionId)
                    .then(result => {
                        // Client side authorize: make sure the user is permitted to edit this submission.
                        // We do server-side authorization on save.
                        const canEditSubmission = this.isUserAdmin || this.currentUserId === result.submittedByUserId;
                        if (canEditSubmission) {
                            this.submission = result;
                            this.tags = result.tags;
                        }
                    })
                    .finally(() => this.isSaving = false);
            }
        }

        tagsInputChanged() {
            // If the user typed a comma, add any existing tag
            if (this.tagsInput.includes(",")) {
                let tags = this.tagsInput.split(",");
                this.tagsInput = "";
                tags.filter(t => t && t.length > 1).forEach(t => this.addTag(t));
            }
        }

        searchTags(search: string): ng.IPromise<string[]> {
            return this.talkApi.searchTags(search);
        }

        removeTag(tag: string) {
            const tagIndex = this.tags.indexOf(tag);
            if (tagIndex >= 0) {
                this.tags.splice(tagIndex, 1);
            }
        }

        autoCompleteTagSelected(tag: string) {
            this.addTag(tag);
            this.tagsInput = "";
        }

        addTag(tag: string) {
            const tagLowered = tag.toLowerCase().trim();
            if (!this.tags.includes(tagLowered) && tagLowered.length > 1) {
                this.tags.push(tagLowered);
                this.tagPlaceholder = "";
            }
        }

        tagsEnterKeyPressed() {
            if (this.tagsInput.length > 1) {
                this.autoCompleteTagSelected(this.tagsInput);
            }
        }

        save() {
            if (!this.isSaving && this.isValid) {
                this.submissionSuccessful = false;
                this.updateSuccessful = false;
                this.submissionError = "";
                this.isSaving = true;

                this.submission.tags = this.tags;
                const shouldCreateNew = !this.submission.id;
                const saveTask = shouldCreateNew ?
                    () => this.talkApi.submitTalk(this.submission) :
                    () => this.talkApi.updateTalk(this.submission);
                saveTask()
                    .then(updatedSubmission => {
                        this.submissionSuccessful = shouldCreateNew;
                        this.updateSuccessful = !shouldCreateNew;
                        this.submission = updatedSubmission;
                    })
                    .catch(error => this.submissionError = JSON.stringify(error))
                    .finally(() => this.isSaving = false);
            }   
        }
    }

    App.controller("SubmitTalkController", SubmitTalkController);
}