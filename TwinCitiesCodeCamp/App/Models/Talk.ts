namespace Tccc {
    export class Talk implements Server.Talk {
        id: string;
        title: string;
        abstract: string;
        author: string;
        authorBio: string;
        authorTwitter: string;
        authorGitHub: string;
        room: string;
        hour: number;
        eventId: string;
        pictureUrl: string;
        tags: string[];
        submissionDate: string;
        submittedByUserId: string;
        status: TalkApproval;

        htmlSafeAbstract: any;
        htmlSafeBio: any;

        constructor(serverObj: Server.Talk) {
            angular.copy(serverObj, this);
        }

        get pictureUrlOrDefault(): string {
            return `/files/getTalkProfileImage?talkId=${this.id}` || "../Content/Images/unknown-speaker.jpg";
        }

        get timeFriendly(): string {
            if (this.hour) {
                return moment()
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .add(this.hour, "hours")
                    .format("h:mm a");
            }

            return "";
        }
    }
}