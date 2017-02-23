namespace Tccc {
    export interface SponsorGroup {
        name: string;
        iconColor: string;
        description?: string;
        sponsors: Sponsor[];
    }
}