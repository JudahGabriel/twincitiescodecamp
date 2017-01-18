var Tccc;
(function (Tccc) {
    var AdminSubmissionsController = (function () {
        function AdminSubmissionsController(isUserAdmin, talkApi) {
            var _this = this;
            this.submissions = [];
            this.currentTalk = null;
            if (!isUserAdmin) {
                window.location.href = "/account/login";
            }
            talkApi.getSubmissions()
                .then(function (results) {
                _this.submissions = results;
                _this.currentTalk = results[0];
            });
        }
        Object.defineProperty(AdminSubmissionsController.prototype, "currentTalkEmail", {
            get: function () {
                return this.currentTalk && this.currentTalk.submittedByUserId ?
                    this.currentTalk.submittedByUserId.replace("ApplicationUsers/", "") : "";
            },
            enumerable: true,
            configurable: true
        });
        return AdminSubmissionsController;
    }());
    AdminSubmissionsController.$inject = [
        "isUserAdmin",
        "talkApi"
    ];
    Tccc.AdminSubmissionsController = AdminSubmissionsController;
    Tccc.App.controller("AdminSubmissionsController", AdminSubmissionsController);
})(Tccc || (Tccc = {}));
