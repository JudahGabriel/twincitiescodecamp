var Tccc;
(function (Tccc) {
    var SponsorService = (function () {
        function SponsorService(apiService, $sce) {
            this.apiService = apiService;
            this.$sce = $sce;
        }
        SponsorService.prototype.getSponsorsForEvent = function (eventId) {
            var _this = this;
            var args = { eventId: eventId };
            var selector = function (serverObjs) { return serverObjs.map(function (s) { return new Tccc.Sponsor(s, _this.$sce); }); };
            return this.apiService.query("/sponsors/getSponsorsForEvent", args, selector);
        };
        SponsorService.prototype.save = function (sponsor) {
            return this.apiService.post("/sponsors/save", sponsor);
        };
        SponsorService.prototype.delete = function (sponsorId) {
            return this.apiService.post("/sponsors/delete?sponsorId=" + sponsorId, null);
        };
        return SponsorService;
    }());
    SponsorService.$inject = ["apiService", "$sce"];
    Tccc.SponsorService = SponsorService;
    Tccc.App.service("sponsorApi", SponsorService);
})(Tccc || (Tccc = {}));
