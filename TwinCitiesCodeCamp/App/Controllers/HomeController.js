var Tccc;
(function (Tccc) {
    var HomeController = /** @class */ (function () {
        function HomeController(talkApi) {
            this.talkApi = talkApi;
            this.speakerFaces = [];
            this.talkTagsTotal = 0;
            this.talkTags = [];
            this.talks = [];
            this.talkSlice = [];
            this.allTalksUrl = "";
        }
        HomeController.prototype.$onInit = function () {
            var _this = this;
            this.talkApi.getTalksForMostRecentEvent()
                .then(function (talks) { return _this.talksLoaded(talks); });
        };
        HomeController.prototype.talksLoaded = function (talks) {
            this.talks = talks;
            this.speakerFaces = _.shuffle(talks)
                .map(function (t) { return t.pictureUrl; })
                .filter(function (u) { return !!u; });
            var allTags = this.getAllTalkTags();
            this.talkTagsTotal = allTags.length;
            this.talkTags = _.shuffle(allTags)
                .slice(0, 20)
                .sort();
            this.talkSlice = _.shuffle(this.talks)
                .slice(0, 5);
            this.allTalksUrl = "#/" + this.talks[0].eventId + "/talks";
        };
        HomeController.prototype.getAllTalkTags = function () {
            return _.uniq(_.flatten(this.talks.map(function (t) { return t.tags; })));
        };
        HomeController.prototype.showAllTags = function () {
            this.talkTags = this.getAllTalkTags().sort();
        };
        HomeController.prototype.getSpeakerUrlForSpeakerFace = function (faceUrl) {
            var talk = this.talks.find(function (t) { return t.pictureUrl === faceUrl; });
            if (talk) {
                return "#/" + talk.id;
            }
            return "";
        };
        HomeController.$inject = [
            "talkApi"
        ];
        return HomeController;
    }());
    Tccc.HomeController = HomeController;
    Tccc.App.controller("HomeController", HomeController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=HomeController.js.map