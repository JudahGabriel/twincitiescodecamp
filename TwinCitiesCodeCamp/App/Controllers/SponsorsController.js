var Tccc;
(function (Tccc) {
    var SponsorsController = (function () {
        function SponsorsController(eventApi, sponsorApi, localStorageService) {
            var _this = this;
            this.localStorageService = localStorageService;
            this.event = null;
            //platinumSponsors: Server.Sponsor[] = [];
            //goldSponsors: Server.Sponsor[] = [];
            //silverSponsors: Server.Sponsor[] = [];
            //bronzeSponsors: Server.Sponsor[] = [];
            this.sponsorGroups = [];
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
            this.sponsorGroups = [
                {
                    name: "Platinum Sponsors",
                    iconColor: "#e5e4e2",
                    description: "Platinum sponsors are the best! They're our biggest fans, and we couldn't host Code Camp without them. While you're at the event, check out their booths and thank them for supporting Code Camp!",
                    sponsors: sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Platinum; })
                },
                {
                    name: "Gold Sponsors",
                    iconColor: "gold",
                    description: "Gold sponsors help us out in a big way. They support Code Camp financially and contribute swag and giveaways for our attendees.",
                    sponsors: sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Gold; })
                },
                {
                    name: "Silver Sponsors",
                    iconColor: "silver",
                    description: "Silver sponsors have donated financially and enable us to host Twin Cities Code Camp.",
                    sponsors: sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Silver; })
                },
                {
                    name: "Bronze Sponsors",
                    iconColor: "rgb(205,127,50)",
                    description: "Bronze sponsors send shirts, backpacks, or other gear to giveaway to attendees at Twin Cities Code Camp.",
                    sponsors: sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Bronze; })
                },
            ];
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
    SponsorsController.sponsorsKey = "sponsors";
    SponsorsController.$inject = [
        "eventApi",
        "sponsorApi",
        "localStorageService"
    ];
    Tccc.SponsorsController = SponsorsController;
    Tccc.App.controller("SponsorsController", SponsorsController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=SponsorsController.js.map