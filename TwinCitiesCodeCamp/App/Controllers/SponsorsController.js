var Tccc;
(function (Tccc) {
    var SponsorsController = (function () {
        function SponsorsController(eventApi, sponsorApi, localStorageService) {
            var _this = this;
            this.localStorageService = localStorageService;
            this.event = null;
            this.platinumSponsors = [];
            this.goldSponsors = [];
            this.silverSponsors = [];
            this.bronzeSponsors = [];
            eventApi.getMostRecentEvent()
                .then(function (e) { return _this.event = e; })
                .then(function (e) { return sponsorApi.getSponsorsForEvent(e.id); })
                .then(function (s) { return _this.sponsorsLoaded(s); });
            var cachedSponsors = localStorage.getItem(SponsorsController.sponsorsKey);
            if (cachedSponsors) {
                this.rehydrateSponsors(cachedSponsors);
            }
        }
        SponsorsController.prototype.sponsorsLoaded = function (sponsors) {
            this.goldSponsors = sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Gold; });
            this.silverSponsors = sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Silver; });
            this.bronzeSponsors = sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Bronze; });
            this.platinumSponsors = sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Platinum; });
            this.localStorageService.set(SponsorsController.sponsorsKey, sponsors);
        };
        SponsorsController.prototype.rehydrateSponsors = function (sponsorsJson) {
            try {
                var rehyrdated = JSON.parse(sponsorsJson);
                this.sponsorsLoaded(rehyrdated);
            }
            catch (error) {
                console.log("Unable to rehydrate sponsors JSON.", error);
            }
        };
        return SponsorsController;
    }());
    SponsorsController.$inject = ["eventApi", "sponsorApi", "localStorageService"];
    SponsorsController.sponsorsKey = "sponsors";
    Tccc.SponsorsController = SponsorsController;
    Tccc.App.controller("SponsorsController", SponsorsController);
})(Tccc || (Tccc = {}));
