namespace Tccc {
    export class AdminSponsorsController {
        sponsors: Sponsor[] = [];
        isSaving = false;
        currentSponsor: Sponsor | null = null;
        mostRecentEventId: string | null = null;
        sponsorshipLevels = [
            { name: "Platinum", value: SponsorshipLevel.Platinum },
            { name: "Gold", value: SponsorshipLevel.Gold },
            { name: "Silver", value: SponsorshipLevel.Silver },
            { name: "Bronze", value: SponsorshipLevel.Bronze }
        ];

        static $inject = [
            "eventApi",
            "sponsorApi",
            "$sce"
        ];

        constructor(private eventApi: EventService, private sponsorApi: SponsorService, private $sce: ng.ISCEService) {
            this.eventApi.getMostRecentEvent()
                .then(e => this.mostRecentEventLoaded(e));
        }

        mostRecentEventLoaded(e: Event) {
            this.mostRecentEventId = e.id;
            this.sponsorApi.getSponsorsForEvent(e.id)
                .then(results => {
                    this.sponsors = results;
                    this.currentSponsor = results[0];
                });
        }

        addSponsor() {
            if (this.mostRecentEventId) {
                var newSponsor = new Sponsor({
                    about: "",
                    createDate: moment().toISOString(),
                    eventId: this.mostRecentEventId,
                    id: null,
                    level: SponsorshipLevel.Bronze,
                    logo: "",
                    name: "",
                    twitter: "",
                    url: ""
                }, this.$sce);
                this.sponsors.push(newSponsor);
                this.currentSponsor = newSponsor;
            }
        }

        deleteSponsor(sponsor: Sponsor) {
            var isNew = !sponsor.id;
            if (isNew) {
                _.pull(this.sponsors, sponsor);
            } else if (!this.isSaving) {
                this.isSaving = true;
                this.sponsorApi.delete(sponsor.id!)
                    .then(() => _.pull(this.sponsors, sponsor))
                    .then(() => this.currentSponsor = this.sponsors[0])
                    .finally(() => this.isSaving = false);
            }
        }

        saveSponsor(sponsor: Sponsor) {
            if (!this.isSaving && sponsor) {
                this.isSaving = true;
                this.sponsorApi.save(sponsor)
                    .then(result => angular.merge(sponsor, result))
                    .finally(() => this.isSaving = false);
            }
        }
    }

    App.controller("AdminSponsorsController", AdminSponsorsController);
}