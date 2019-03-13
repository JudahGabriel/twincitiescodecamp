namespace Tccc {
    export class Event implements Server.Event {
        id: string;
        registerUrl: string;
        dateTime: string;
        locationFriendlyName: string;
        address: string;
        number: number;
        seasonYear: string;
        isAcceptingTalkSubmissions: boolean;
        noTalkSubmissionsAfter: string | null;

        lastRawDate: Date | null = null;
        isSaving = false;

        constructor(serverObj?: Server.Event) {
            if (serverObj) {
                angular.copy(serverObj, this);
            }
        }

        get friendlyDate(): string {
            return moment(this.dateTime).format("MMMM D, YYYY h:mm A");
        }

        // raw date for binding Date objects in Angular to HTML5 date input.
        get rawDate(): Date | null {
            if (!this.lastRawDate && this.dateTime) {
                this.lastRawDate = moment(this.dateTime).toDate();
            }

            return this.lastRawDate;
        }

        set rawDate(val: Date | null) {
            if (val) {
                this.dateTime = val.toISOString();
                this.lastRawDate = val;
            } else {
                this.lastRawDate = new Date();
                this.dateTime = this.lastRawDate.toISOString();
            }
        }

        get callForSpeakersOpened(): boolean {
            const callForSpeakersStarted = this.isAcceptingTalkSubmissions;
            const callForSpakersEnded = !!this.noTalkSubmissionsAfter && new Date() > new Date(this.noTalkSubmissionsAfter);
            return callForSpeakersStarted && !callForSpakersEnded;
        }
    }
}