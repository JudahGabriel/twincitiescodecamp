namespace Tccc {
    export class SponsorsController {
        event: Server.Event = null;
        platinumSponsors: Server.Sponsor[] = [];
        goldSponsors: Server.Sponsor[] = [];
        silverSponsors: Server.Sponsor[] = [];
        bronzeSponsors: Server.Sponsor[] = [];

        static $inject = ["eventApi", "sponsorApi", "localStorageService"];
        static sponsorsKey = "sponsors";

        constructor(
            eventApi: EventService, sponsorApi: SponsorService,
            private localStorageService: ng.local.storage.ILocalStorageService) {
            eventApi.getMostRecentEvent()
                .then(e => this.event = e)
                .then(e => sponsorApi.getSponsorsForEvent(e.id))
                .then(s => this.sponsorsLoaded(s));

            var cachedSponsors = localStorage.getItem(SponsorsController.sponsorsKey);
            if (cachedSponsors) {
                this.rehydrateSponsors(cachedSponsors);
            }
        }

        sponsorsLoaded(sponsors: Sponsor[]) {
            this.goldSponsors = sponsors.filter(s => s.level === SponsorshipLevel.Gold);
            this.silverSponsors = sponsors.filter(s => s.level === SponsorshipLevel.Silver);
            this.bronzeSponsors = sponsors.filter(s => s.level === SponsorshipLevel.Bronze);
            this.platinumSponsors = sponsors.filter(s => s.level === SponsorshipLevel.Platinum);
            this.localStorageService.set(SponsorsController.sponsorsKey, sponsors);
        }

        rehydrateSponsors(sponsorsJson: string) {
            try {
                var rehyrdated: Sponsor[] = JSON.parse(sponsorsJson);
                this.sponsorsLoaded(rehyrdated);
            }
            catch(error) {
                console.log("Unable to rehydrate sponsors JSON.", error);
            }
        }
    }

    App.controller("SponsorsController", SponsorsController);
}