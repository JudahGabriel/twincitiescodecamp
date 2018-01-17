var Tccc;
(function (Tccc) {
    var Sponsor = /** @class */ (function () {
        function Sponsor(serverObj, $sce) {
            angular.copy(serverObj, this);
            if (this.about) {
                this.aboutHtmlSafe = $sce.trustAsHtml(this.about);
            }
            if (this.url && this.url.indexOf("://")) {
                this.urlFriendly = this.url.substr(this.url.indexOf("://") + 3);
            }
        }
        Object.defineProperty(Sponsor.prototype, "levelText", {
            get: function () {
                if (this.level === Tccc.SponsorshipLevel.Platinum) {
                    return "Platinum";
                }
                else if (this.level === Tccc.SponsorshipLevel.Gold) {
                    return "Gold";
                }
                else if (this.level === Tccc.SponsorshipLevel.Silver) {
                    return "Silver";
                }
                else {
                    return "Bronze";
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sponsor.prototype, "levelColor", {
            get: function () {
                if (this.level === Tccc.SponsorshipLevel.Platinum) {
                    return "rgb(229, 228, 226)";
                }
                else if (this.level === Tccc.SponsorshipLevel.Gold) {
                    return "gold";
                }
                else if (this.level === Tccc.SponsorshipLevel.Silver) {
                    return "silver";
                }
                else {
                    return "rgb(205, 127, 50)";
                }
            },
            enumerable: true,
            configurable: true
        });
        return Sponsor;
    }());
    Tccc.Sponsor = Sponsor;
})(Tccc || (Tccc = {}));
//# sourceMappingURL=Sponsor.js.map