namespace Tccc {
    export class SponsorService {

        static $inject = ["apiService", "$sce"];

        constructor(private apiService: ApiService, private $sce: ng.ISCEService) {
        }

        getSponsorsForEvent(eventId: string): ng.IPromise<Sponsor[]> {
            var args = { eventId: eventId };
            var selector = (serverObjs: Server.Sponsor[]) => serverObjs.map(s => new Sponsor(s, this.$sce));
            return this.apiService.query("/sponsors/getsponsorsforevent", args, selector);
        }
    }

    App.service("sponsorApi", SponsorService);
}