namespace Tccc {
    export class AdminSubmissionsController {

        totalTalks = 0;
        pendingSubmissions: Server.TalkSubmission[] = [];
        approvedSubmissions: Server.TalkSubmission[] = [];
        rejectedSubmissions: Server.TalkSubmission[] = [];
        currentTalk: Server.TalkSubmission | null = null;
        selectedFilter = TalkApproval.Pending;
        approvalOptions = [
            { value: TalkApproval.Pending, name: "Pending", collection: this.pendingSubmissions },
            { value: TalkApproval.Approved, name: "Approved", collection: this.approvedSubmissions },
            { value: TalkApproval.Rejected, name: "Rejected", collection: this.rejectedSubmissions },
        ];
        isSaving = false;

        static $inject = [
            "isUserAdmin",
            "talkApi"
        ];

        constructor(
            isUserAdmin: boolean,
            private talkApi: TalkService) {

            if (!isUserAdmin) {
                window.location.href = "/account/login";
            }

            this.fetchSubmissions();
        }

        get currentTalkEmail(): string {
            return this.currentTalk && this.currentTalk.submittedByUserId ?
                this.currentTalk.submittedByUserId.replace("ApplicationUsers/", "") : "";
        }

        get submissions(): Server.TalkSubmission[] {
            if (this.selectedFilter === TalkApproval.Approved) {
                return this.approvedSubmissions;
            } else if (this.selectedFilter === TalkApproval.Rejected) {
                return this.rejectedSubmissions;
            } 

            return this.pendingSubmissions;
        }

        get currentTalkStatus(): string {
            if (this.currentTalk) {
                var desiredStatus = this.currentTalk.status;
                var status = this.approvalOptions.find(o => o.value === desiredStatus);
                if (status) {
                    return status.name;
                }
            }

            return "";
        }

        fetchSubmissions() {
            this.talkApi.getSubmissions()
                .then(results => {
                    this.pendingSubmissions.push(...results.filter(t => t.status === TalkApproval.Pending));
                    this.approvedSubmissions.push(...results.filter(t => t.status === TalkApproval.Approved));
                    this.rejectedSubmissions.push(...results.filter(t => t.status === TalkApproval.Rejected));
                    this.currentTalk = this.submissions[0];
                    this.totalTalks = results.length;
                });
        }

        setApprovalStatus(talk: Server.TalkSubmission, status: TalkApproval) {
            if (!this.isSaving && talk.id) {
                this.isSaving = true;
                if (status === TalkApproval.Approved) {
                    this.talkApi.approve(talk.id)
                        .then(result => {
                            // Approve the talk, move it into the right collection.
                            talk.status = result.status;
                            _.pull(this.pendingSubmissions, talk);
                            this.approvedSubmissions.push(talk);
                            this.currentTalk = this.submissions[0];
                        })
                        .finally(() => this.isSaving = false);
                } else if (status === TalkApproval.Rejected) {
                    this.talkApi.reject(talk.id)
                        .then(result => {
                            // Reject the talk, move it into the right collection.
                            _.pull(this.pendingSubmissions, talk);
                            this.rejectedSubmissions.push(talk);
                            talk.status = result.status;
                            this.currentTalk = this.submissions[0];
                        })
                        .finally(() => this.isSaving = false);
                }
            }
        }
    }

    App.controller("AdminSubmissionsController", AdminSubmissionsController);
}