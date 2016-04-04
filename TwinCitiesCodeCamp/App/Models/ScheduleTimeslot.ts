namespace Tccc {
    export class ScheduleTimeslot implements Server.ScheduleTimeslot {
        start: number;
        duration: number;
        items: ScheduleItem[];

        constructor(serverObj: Server.ScheduleTimeslot) {
            angular.copy(serverObj, this);
            this.items = serverObj.items.map(i => new ScheduleItem(i));
        }

        get startFriendly(): string {
            return moment()
                .hour(0)
                .minute(0)
                .second(0)
                .add(this.start, "hours")
                .format("h:mm a");
        }
    }
}