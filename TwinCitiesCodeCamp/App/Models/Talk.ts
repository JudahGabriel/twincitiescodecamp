namespace Tccc {
    export class Talk implements Server.Talk {
        id: string;
        title: string;
        abstract: string;
        author: string;
        authorBio: string;
        authorTwitter: string;
        room: string;
        hour: number;
        eventId: string;

        htmlSafeAbstract: any;

        constructor(serverObj: Server.Talk) {
            angular.copy(serverObj, this);
        }

        get timeFriendly(): string {
            return moment()
                .hour(0)
                .minute(0)
                .second(0)
                .add(this.hour, "hours")
                .format("h:mm a");
        }
    }
}