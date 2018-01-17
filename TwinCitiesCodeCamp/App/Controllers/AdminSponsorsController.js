var Tccc;
(function (Tccc) {
    var AdminSponsorsController = /** @class */ (function () {
        function AdminSponsorsController(eventApi, sponsorApi, isUserAdmin, $sce) {
            this.eventApi = eventApi;
            this.sponsorApi = sponsorApi;
            this.isUserAdmin = isUserAdmin;
            this.$sce = $sce;
            this.sponsors = [];
            this.isSaving = false;
            this.currentSponsor = null;
            this.mostRecentEventId = null;
            this.sponsorshipLevels = [
                { name: "Diamond", value: Tccc.SponsorshipLevel.Diamond },
                { name: "Platinum", value: Tccc.SponsorshipLevel.Platinum },
                { name: "Gold", value: Tccc.SponsorshipLevel.Gold },
                { name: "Silver", value: Tccc.SponsorshipLevel.Silver },
                { name: "Bronze", value: Tccc.SponsorshipLevel.Bronze },
            ];
        }
        AdminSponsorsController.prototype.$onInit = function () {
            var _this = this;
            this.eventApi.getMostRecentEvent()
                .then(function (e) { return _this.mostRecentEventLoaded(e); });
            if (!this.isUserAdmin) {
                window.location.href = "/account/login";
            }
        };
        AdminSponsorsController.prototype.mostRecentEventLoaded = function (e) {
            var _this = this;
            this.mostRecentEventId = e.id;
            this.sponsorApi.getSponsorsForEvent(e.id)
                .then(function (results) {
                _this.sponsors = results;
                _this.currentSponsor = results[0];
            });
        };
        AdminSponsorsController.prototype.addSponsor = function () {
            if (this.mostRecentEventId) {
                var newSponsor = new Tccc.Sponsor({
                    about: "",
                    createDate: moment().toISOString(),
                    eventId: this.mostRecentEventId,
                    id: null,
                    level: Tccc.SponsorshipLevel.Bronze,
                    logo: "",
                    name: "",
                    twitter: "",
                    url: ""
                }, this.$sce);
                this.sponsors.push(newSponsor);
                this.currentSponsor = newSponsor;
            }
        };
        AdminSponsorsController.prototype.deleteSponsor = function (sponsor) {
            var _this = this;
            var isNew = !sponsor.id;
            if (isNew) {
                _.pull(this.sponsors, sponsor);
            }
            else if (!this.isSaving) {
                this.isSaving = true;
                this.sponsorApi.delete(sponsor.id)
                    .then(function () { return _.pull(_this.sponsors, sponsor); })
                    .then(function () { return _this.currentSponsor = _this.sponsors[0]; })
                    .finally(function () { return _this.isSaving = false; });
            }
        };
        AdminSponsorsController.prototype.saveSponsor = function (sponsor) {
            var _this = this;
            if (!this.isSaving && sponsor) {
                this.isSaving = true;
                this.sponsorApi.save(sponsor)
                    .then(function (result) { return angular.merge(sponsor, result); })
                    .finally(function () { return _this.isSaving = false; });
            }
        };
        AdminSponsorsController.$inject = [
            "eventApi",
            "sponsorApi",
            "isUserAdmin",
            "$sce"
        ];
        return AdminSponsorsController;
    }());
    Tccc.AdminSponsorsController = AdminSponsorsController;
    Tccc.App.controller("AdminSponsorsController", AdminSponsorsController);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=AdminSponsorsController.js.map