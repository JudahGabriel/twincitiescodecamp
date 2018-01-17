var Tccc;
(function (Tccc) {
    var MyTalksController = /** @class */ (function () {
        function MyTalksController(isSignedIn, talkApi) {
            var _this = this;
            this.isSignedIn = isSignedIn;
            this.talkApi = talkApi;
            this.submissions = new Tccc.List(function () { return _this.talkApi.getMySubmissions(); });
        }
        MyTalksController.prototype.$onInit = function () {
            this.submissions.fetch();
        };
        MyTalksController.$inject = [
            "isSignedIn",
            "talkApi"
        ];
        return MyTalksController;
    }());
    Tccc.MyTalksController = MyTalksController;
    Tccc.App.controller("MyTalksController", MyTalksController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=MyTalksController.js.map