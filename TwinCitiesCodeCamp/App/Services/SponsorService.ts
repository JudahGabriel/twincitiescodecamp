namespace Tccc {
    export class SponsorService {

        static $inject = ["apiService", "$sce"];

        constructor(private apiService: ApiService, private $sce: ng.ISCEService) {
        }

        getSponsorsForEvent(eventId: string): ng.IPromise<Sponsor[]> {
            var args = { eventId: eventId };
            var selector = (serverObjs: Server.Sponsor[]) => serverObjs.map(s => new Sponsor(s, this.$sce));
            return this.apiService.query("/sponsors/getSponsorsForEvent", args, selector);
        }

        save(sponsor: Sponsor): ng.IPromise<Sponsor> {
            return this.apiService.post("/sponsors/save", sponsor);
        }

        delete(sponsorId: string): ng.IPromise<any> {
            return this.apiService.post("/sponsors/delete?sponsorId=" + sponsorId, null);
        }
    }

    App.service("sponsorApi", SponsorService);
}