namespace Tccc {
    export class ScheduleItem implements Server.ScheduleItem {
        title: string;
        talkId: string;
        room: string;
        author: string;
        
        constructor(serverObj: Server.ScheduleItem) {
            angular.copy(serverObj, this);
        }
    }
}