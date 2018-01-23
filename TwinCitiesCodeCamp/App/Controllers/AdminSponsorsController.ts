namespace Tccc {
    export class AdminSponsorsController {
        sponsors: Sponsor[] = [];
        isSaving = false;
        currentSponsor: Sponsor | null = null;
        readonly eventId: string;
        sponsorshipLevels = [
            { name: "Diamond", value: SponsorshipLevel.Diamond },
            { name: "Platinum", value: SponsorshipLevel.Platinum },
            { name: "Gold", value: SponsorshipLevel.Gold },
            { name: "Silver", value: SponsorshipLevel.Silver },
            { name: "Bronze", value: SponsorshipLevel.Bronze },
        ];

        static $inject = [
            "eventApi",
            "sponsorApi",
            "isUserAdmin",
            "$sce",
            "$routeParams"
        ];

        constructor(
            private eventApi: EventService,
            private sponsorApi: SponsorService,
            private isUserAdmin: boolean,
            private $sce: ng.ISCEService,
            private $routeParams: ng.route.IRouteParamsService) {

            const eventNumber = $routeParams["eventNumber"];
            this.eventId = `events/${eventNumber}`;
        }

        $onInit() {
            this.sponsorApi.getSponsorsForEvent(this.eventId)
                .then(results => {
                    this.sponsors = results;
                    this.currentSponsor = results[0];
                });
        }

        addSponsor() {
            if (this.eventId) {
                var newSponsor = new Sponsor({
                    about: "",
                    createDate: moment().toISOString(),
                    eventId: this.eventId,
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