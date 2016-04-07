var Tccc;
(function (Tccc) {
    var Sponsor = (function () {
        function Sponsor(serverObj, $sce) {
            angular.copy(serverObj, this);
            if (this.about) {
                this.aboutHtmlSafe = $sce.trustAsHtml(this.about);
            }
            if (this.url && this.url.indexOf("://")) {
                this.urlFriendly = this.url.substr(this.url.indexOf("://") + 3);
            }
        }
        return Sponsor;
    }());
    Tccc.Sponsor = Sponsor;
})(Tccc || (Tccc = {}));
//# sourceMappingURL=Sponsor.js.map