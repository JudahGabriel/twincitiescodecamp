namespace Tccc {
    export class Sponsor implements Server.Sponsor {
        id: string | null;
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

        get levelText(): string {
            if (this.level === SponsorshipLevel.Platinum) {
                return "Platinum";
            } else if (this.level === SponsorshipLevel.Gold) {
                return "Gold";
            } else if (this.level === SponsorshipLevel.Silver) {
                return "Silver";
            } else {
                return "Bronze";
            }
        }

        get levelColor(): string {
            if (this.level === SponsorshipLevel.Platinum) {
                return "rgb(229, 228, 226)";
            } else if (this.level === SponsorshipLevel.Gold) {
                return "gold";
            } else if (this.level === SponsorshipLevel.Silver) {
                return "silver";
            } else {
                return "rgb(205, 127, 50)";
            }
        }
    }
}