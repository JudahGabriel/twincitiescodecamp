var Tccc;
(function (Tccc) {
    var MyTalksController = (function () {
        function MyTalksController(isSignedIn, talkApi) {
            var _this = this;
            this.isSignedIn = isSignedIn;
            this.talkApi = talkApi;
            this.submissions = new Tccc.List(function () { return _this.talkApi.getMySubmissions(); });
            this.submissions.fetch();
        }
        return MyTalksController;
    }());
    MyTalksController.$inject = [
        "isSignedIn",
        "talkApi"
    ];
    Tccc.MyTalksController = MyTalksController;
    Tccc.App.controller("MyTalksController", MyTalksController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=MyTalksController.js.map