var Tccc;
(function (Tccc) {
    var SponsorsController = (function () {
        function SponsorsController(eventApi, sponsorApi, localStorageService) {
            var _this = this;
            this.localStorageService = localStorageService;
            this.event = null;
            this.goldSponsors = [];
            this.silverSponsors = [];
            this.bronzeSponsors = [];
            eventApi.getMostRecentEvent()
                .then(function (e) { return _this.event = e; })
                .then(function (e) { return sponsorApi.getSponsorsForEvent(e.id); })
                .then(function (s) { return _this.sponsorsLoaded(s); });
            var cachedSponsors = localStorage.getItem(SponsorsController.sponsorsKey);
            if (cachedSponsors) {
                this.sponsorsLoaded(cachedSponsors);
            }
        }
        SponsorsController.prototype.sponsorsLoaded = function (sponsors) {
            this.goldSponsors = sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Gold; });
            this.silverSponsors = sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Silver; });
            this.bronzeSponsors = sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Bronze; });
            this.localStorageService.set(SponsorsController.sponsorsKey, sponsors);
        };
        SponsorsController.$inject = ["eventApi", "sponsorApi", "localStorageService"];
        SponsorsController.sponsorsKey = "sponsors";
        return SponsorsController;
    }());
    Tccc.SponsorsController = SponsorsController;
    Tccc.App.controller("SponsorsController", SponsorsController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=SponsorsController.js.map