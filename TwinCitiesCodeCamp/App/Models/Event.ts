namespace Tccc {
    export class Event implements Server.Event {
        id: string;
        registerUrl: string;
        dateTime: string;
        locationFriendlyName: string;
        address: string;
        number: number;

        constructor(serverObj?: Server.Event) {
            if (serverObj) {
                angular.copy(serverObj, this);
            }
        }

        get friendlyDate(): string {
            return moment(this.dateTime).format("MMMM D, YYYY h:mm A");
        }
    }
}