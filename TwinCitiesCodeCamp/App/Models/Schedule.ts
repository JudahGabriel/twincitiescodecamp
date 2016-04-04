namespace Tccc {
    export class Schedule implements Server.Schedule {
        id: string;
        eventId: string;
        timeslots: ScheduleTimeslot[];

        constructor(serverObj: Server.Schedule) {
            angular.copy(serverObj, this);
            this.timeslots = serverObj.timeslots.map(s => new ScheduleTimeslot(s));
        }

        getRooms(): string[] {
            var rooms: string[] = [];
            this.timeslots.forEach(t => {
                t.items.forEach(i => {
                    if (i.room && !rooms.includes(i.room)) {
                        rooms.push(i.room);
                    }
                });
            });

            rooms.sort();
            return rooms;
        }
    }
}