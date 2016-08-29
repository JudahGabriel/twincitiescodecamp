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
            return this.apiService.query("/sponsors/getsponsorsforevent", args, selector);
        };
        SponsorService.$inject = ["apiService", "$sce"];
        return SponsorService;
    }());
    Tccc.SponsorService = SponsorService;
    Tccc.App.service("sponsorApi", SponsorService);
})(Tccc || (Tccc = {}));
