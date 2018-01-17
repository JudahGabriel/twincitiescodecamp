var Tccc;
(function (Tccc) {
    var SponsorsController = /** @class */ (function () {
        function SponsorsController(eventApi, sponsorApi, localStorageService) {
            this.eventApi = eventApi;
            this.sponsorApi = sponsorApi;
            this.localStorageService = localStorageService;
            this.event = null;
            //platinumSponsors: Server.Sponsor[] = [];
            //goldSponsors: Server.Sponsor[] = [];
            //silverSponsors: Server.Sponsor[] = [];
            //bronzeSponsors: Server.Sponsor[] = [];
            this.sponsorGroups = [];
        }
        SponsorsController.prototype.$onInit = function () {
            var _this = this;
            this.eventApi.getMostRecentEvent()
                .then(function (e) { return _this.event = e; })
                .then(function (e) { return _this.sponsorApi.getSponsorsForEvent(e.id); })
                .then(function (s) { return _this.sponsorsLoaded(s); });
            var cachedSponsors = localStorage.getItem(SponsorsController.sponsorsKey);
            if (cachedSponsors) {
                this.rehydrateSponsors(cachedSponsors);
            }
        };
        SponsorsController.prototype.sponsorsLoaded = function (sponsors) {
            this.sponsorGroups = [
                {
                    name: "Diamond Sponsors",
                    iconColor: "white",
                    description: "Diamond sponsors are the best! They're our biggest fans, and we couldn't host Code Camp without them. While you're at the event, check out their booths and thank them for supporting Code Camp!",
                    sponsors: sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Diamond; })
                },
                {
                    name: "Platinum Sponsors",
                    iconColor: "#e5e4e2",
                    description: "Platinum sponsors help us out in a big way. They support Code Camp financially, have contributed giveaways to attendees, and host booth at Code Camp.",
                    sponsors: sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Platinum; })
                },
                {
                    name: "Gold Sponsors",
                    iconColor: "gold",
                    description: "Gold sponsors have donated financially and enable us to host Twin Cities Code Camp.",
                    sponsors: sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Gold; })
                },
                {
                    name: "Silver Sponsors",
                    iconColor: "silver",
                    description: "Silver sponsors have donated shirts, backpacks, or other gear to giveaway to attendees at Twin Cities Code Camp.",
                    sponsors: sponsors.filter(function (s) { return s.level === Tccc.SponsorshipLevel.Silver; })
                }
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
        SponsorsController.sponsorsKey = "sponsors";
        SponsorsController.$inject = [
            "eventApi",
            "sponsorApi",
            "localStorageService"
        ];
        return SponsorsController;
    }());
    Tccc.SponsorsController = SponsorsController;
    Tccc.App.controller("SponsorsController", SponsorsController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=SponsorsController.js.map