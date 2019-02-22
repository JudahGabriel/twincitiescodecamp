var Tccc;
(function (Tccc) {
    var AdminSubmissionsController = /** @class */ (function () {
        function AdminSubmissionsController(isUserAdmin, talkApi, $routeParams) {
            this.isUserAdmin = isUserAdmin;
            this.talkApi = talkApi;
            this.totalTalks = 0;
            this.pendingSubmissions = [];
            this.approvedSubmissions = [];
            this.rejectedSubmissions = [];
            this.currentTalk = null;
            this.selectedFilter = Tccc.TalkApproval.Pending;
            this.approvalOptions = [
                { value: Tccc.TalkApproval.Pending, name: "Pending", collection: this.pendingSubmissions },
                { value: Tccc.TalkApproval.Approved, name: "Approved", collection: this.approvedSubmissions },
                { value: Tccc.TalkApproval.Rejected, name: "Rejected", collection: this.rejectedSubmissions },
            ];
            this.isSaving = false;
            this.eventId = "events/" + $routeParams["eventNumber"];
        }
        AdminSubmissionsController.prototype.$onInit = function () {
            if (!this.isUserAdmin) {
                window.location.href = "/account/login";
            }
            this.fetchSubmissions();
        };
        Object.defineProperty(AdminSubmissionsController.prototype, "currentTalkEmail", {
            //get getGoogleDocText() {
            //    if (this.currentTalk) {
            //        var idLower = this.currentTalk.id ? this.currentTalk.id.toLowerCase() : "";
            //        var tags = this.currentTalk.tags.map(t => "🏷️ " + t).join(", ");
            //        return `${this.currentTalk.title} https://twincitiescodecamp.com/#/${idLower} ${tags}`;
            //    }
            //    return "";
            //}
            get: function () {
                return this.currentTalk && this.currentTalk.submittedByUserId ?
                    this.currentTalk.submittedByUserId.replace("ApplicationUsers/", "") : "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdminSubmissionsController.prototype, "submissions", {
            get: function () {
                if (this.selectedFilter === Tccc.TalkApproval.Approved) {
                    return this.approvedSubmissions;
                }
                else if (this.selectedFilter === Tccc.TalkApproval.Rejected) {
                    return this.rejectedSubmissions;
                }
                return this.pendingSubmissions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdminSubmissionsController.prototype, "currentTalkStatus", {
            get: function () {
                if (this.currentTalk) {
                    var desiredStatus = this.currentTalk.status;
                    var status = this.approvalOptions.find(function (o) { return o.value === desiredStatus; });
                    if (status) {
                        return status.name;
                    }
                }
                return "";
            },
            enumerable: true,
            configurable: true
        });
        AdminSubmissionsController.prototype.fetchSubmissions = function () {
            var _this = this;
            this.talkApi.getSubmissions(this.eventId)
                .then(function (results) {
                (_a = _this.pendingSubmissions).push.apply(_a, results.filter(function (t) { return t.status === Tccc.TalkApproval.Pending; }));
                (_b = _this.approvedSubmissions).push.apply(_b, results.filter(function (t) { return t.status === Tccc.TalkApproval.Approved; }));
                (_c = _this.rejectedSubmissions).push.apply(_c, results.filter(function (t) { return t.status === Tccc.TalkApproval.Rejected; }));
                _this.currentTalk = _this.submissions[0];
                _this.totalTalks = results.length;
                var _a, _b, _c;
            });
        };
        AdminSubmissionsController.prototype.setApprovalStatus = function (talk, status) {
            var _this = this;
            if (!this.isSaving && talk.id) {
                this.isSaving = true;
                if (status === Tccc.TalkApproval.Approved) {
                    this.talkApi.approve(talk.id)
                        .then(function (result) {
                        // Approve the talk, move it into the right collection.
                        talk.status = result.status;
                        _.pull(_this.pendingSubmissions, talk);
                        _this.approvedSubmissions.push(talk);
                        _this.currentTalk = _this.submissions[0];
                    })
                        .finally(function () { return _this.isSaving = false; });
                }
                else if (status === Tccc.TalkApproval.Rejected) {
                    this.talkApi.reject(talk.id)
                        .then(function (result) {
                        // Reject the talk, move it into the right collection.
                        _.pull(_this.pendingSubmissions, talk);
                        _this.rejectedSubmissions.push(talk);
                        talk.status = result.status;
                        _this.currentTalk = _this.submissions[0];
                    })
                        .finally(function () { return _this.isSaving = false; });
                }
            }
        };
        AdminSubmissionsController.$inject = [
            "isUserAdmin",
            "talkApi",
            "$routeParams"
        ];
        return AdminSubmissionsController;
    }());
    Tccc.AdminSubmissionsController = AdminSubmissionsController;
    Tccc.App.controller("AdminSubmissionsController", AdminSubmissionsController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=AdminSubmissionsController.js.map