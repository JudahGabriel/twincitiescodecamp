namespace Tccc {
    export class SponsorsController {
        event: Server.Event = null;
        goldSponsors: Server.Sponsor[] = [];
        silverSponsors: Server.Sponsor[] = [];
        bronzeSponsors: Server.Sponsor[] = [];

        static $inject = ["eventApi", "sponsorApi", "localStorageService"];
        static sponsorsKey = "sponsors";

        constructor(eventApi: EventService, sponsorApi: SponsorService, private localStorageService: ng.local.storage.ILocalStorageService) {
            eventApi.getMostRecentEvent()
                .then(e => this.event = e)
                .then(e => sponsorApi.getSponsorsForEvent(e.id))
                .then(s => this.sponsorsLoaded(s));

            var cachedSponsors = localStorage.getItem(SponsorsController.sponsorsKey);
            if (cachedSponsors) {
                this.sponsorsLoaded(cachedSponsors);
            }
        }

        sponsorsLoaded(sponsors: Sponsor[]) {
            this.goldSponsors = sponsors.filter(s => s.level === SponsorshipLevel.Gold);
            this.silverSponsors = sponsors.filter(s => s.level === SponsorshipLevel.Silver);
            this.bronzeSponsors = sponsors.filter(s => s.level === SponsorshipLevel.Bronze);
            this.localStorageService.set(SponsorsController.sponsorsKey, sponsors);
        }
    }

    App.controller("SponsorsController", SponsorsController);
}