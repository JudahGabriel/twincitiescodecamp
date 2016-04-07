namespace Tccc {
    export class Sponsor implements Server.Sponsor {
        id: string;
        eventId: string;
        name: string;
        about: string;
        logo: string;
        url: string;
        level: SponsorshipLevel;
        twitter: string;
        createDate: string;

        aboutHtmlSafe: string;
        urlFriendly: string;

        constructor(serverObj: Server.Sponsor, $sce: ng.ISCEService) {
            angular.copy(serverObj, this);

            if (this.about) {
                this.aboutHtmlSafe = $sce.trustAsHtml(this.about);
            }

            if (this.url && this.url.indexOf("://")) {
                this.urlFriendly = this.url.substr(this.url.indexOf("://") + 3);
            }
        }
    }
}