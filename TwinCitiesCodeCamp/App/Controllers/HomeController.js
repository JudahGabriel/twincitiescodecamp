var Tccc;
(function (Tccc) {
    var HomeController = /** @class */ (function () {
        function HomeController(talkApi) {
            var _this = this;
            this.talkApi = talkApi;
            this.speakerFaces = [];
            this.talkTagsTotal = 0;
            this.talkTags = [];
            this.talks = new Tccc.List(function () { return _this.talkApi.getTalksForMostRecentEvent(); }, "talks-most-recent-event", function (json) { return new Tccc.Talk(json); }, function (results) { return _this.talksLoaded(results); });
            this.talkSlice = [];
            this.allTalksUrl = "";
        }
        HomeController.prototype.$onInit = function () {
            this.talks.fetch();
        };
        HomeController.prototype.talksLoaded = function (talks) {
            this.speakerFaces = _.shuffle(talks)
                .map(function (t) { return t.pictureUrl; })
                .filter(function (u) { return !!u; });
            var allTags = this.getAllTalkTags(talks);
            this.talkTagsTotal = allTags.length;
            this.talkTags = _.shuffle(allTags)
                .slice(0, 20)
                .sort();
            this.talkSlice = _.shuffle(talks)
                .slice(0, 5);
            if (this.allTalksUrl.length > 0) {
                this.allTalksUrl = "#/" + talks[0].eventId + "/talks";
            }
        };
        HomeController.prototype.getAllTalkTags = function (talks) {
            return _.uniq(_.flatten(talks.map(function (t) { return t.tags; })));
        };
        HomeController.prototype.showAllTags = function () {
            this.talkTags = this.getAllTalkTags(this.talks.items).sort();
        };
        HomeController.prototype.getSpeakerUrlForSpeakerFace = function (faceUrl) {
            var talk = this.talks.items.find(function (t) { return t.pictureUrl === faceUrl; });
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