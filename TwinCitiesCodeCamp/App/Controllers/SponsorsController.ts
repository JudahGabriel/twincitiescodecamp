﻿namespace Tccc {
    export class SponsorsController {
        event: Server.Event | null = null;
        //platinumSponsors: Server.Sponsor[] = [];
        //goldSponsors: Server.Sponsor[] = [];
        //silverSponsors: Server.Sponsor[] = [];
        //bronzeSponsors: Server.Sponsor[] = [];
        sponsorGroups: SponsorGroup[] = [];

        static sponsorsKey = "sponsors";
        static $inject = [
            "eventApi",
            "sponsorApi",
            "localStorageService"
        ];

        constructor(
            private eventApi: EventService,
            private sponsorApi: SponsorService,
            private localStorageService: ng.local.storage.ILocalStorageService) {
        }

        $onInit() {
            this.eventApi.getMostRecentEvent()
                .then(e => this.event = e)
                .then(e => this.sponsorApi.getSponsorsForEvent(e.id))
                .then(s => this.sponsorsLoaded(s));

            var cachedSponsors = localStorage.getItem(SponsorsController.sponsorsKey);
            if (cachedSponsors) {
                this.rehydrateSponsors(cachedSponsors);
            }
        }

        sponsorsLoaded(sponsors: Sponsor[]) {
            this.sponsorGroups = [
                {
                    name: "Diamond Sponsors",
                    iconColor: "white",
                    description: "Diamond sponsors are the best! They're our biggest fans, and we couldn't host Code Camp without them. While you're at the event, check out their booths and thank them for supporting Code Camp!",
                    sponsors: sponsors.filter(s => s.level === SponsorshipLevel.Diamond)
                },
                {
                    name: "Platinum Sponsors",
                    iconColor: "#e5e4e2",
                    description: "Platinum sponsors help us out in a big way. They support Code Camp financially, have contributed giveaways to attendees, and host booth at Code Camp.",
                    sponsors: sponsors.filter(s => s.level === SponsorshipLevel.Platinum)
                },
                {
                    name: "Gold Sponsors",
                    iconColor: "gold",
                    description: "Gold sponsors have donated financially and enable us to host Twin Cities Code Camp.",
                    sponsors: sponsors.filter(s => s.level === SponsorshipLevel.Gold)
                },
                {
                    name: "Silver Sponsors",
                    iconColor: "silver",
                    description: "Silver sponsors have donated shirts, backpacks, or other gear to giveaway to attendees at Twin Cities Code Camp.",
                    sponsors: sponsors.filter(s => s.level === SponsorshipLevel.Silver)
                }
            ];
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