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
            if (this.level === SponsorshipLevel.Diamond) {
                return "Diamond";
            }

            if (this.level === SponsorshipLevel.Platinum) {
                return "Platinum";
            }

            if (this.level === SponsorshipLevel.Gold) {
                return "Gold";
            }

            if (this.level === SponsorshipLevel.Silver) {
                return "Silver";
            }

            return "Bronze";
        }

        get levelColor(): string {
            if (this.level === SponsorshipLevel.Diamond) {
                return "white";
            }
            if (this.level === SponsorshipLevel.Platinum) {
                return "rgb(229, 228, 226)";
            }

            if (this.level === SponsorshipLevel.Gold) {
                return "gold";
            }

            if (this.level === SponsorshipLevel.Silver) {
                return "silver";
            }

            return "rgb(205, 127, 50)";
        }
    }
}