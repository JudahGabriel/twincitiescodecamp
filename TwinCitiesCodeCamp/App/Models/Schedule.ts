namespace Tccc {
    export class Schedule implements Server.Schedule {
        id: string;
        eventId: string;
        timeslots: ScheduleTimeslot[];

        isSaving = false;

        constructor(serverObj: Server.Schedule) {
            angular.copy(serverObj, this);
            this.timeslots = serverObj.timeslots.map(s => new ScheduleTimeslot(s));
        }

        get friendlyName(): string {
            if (this.eventId && this.eventId.includes("/")) {
                return "Schedule for #tccc" + this.eventId.substr(this.eventId.indexOf("/") + 1);
            }

            return "[untitled schedule]";
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

        static empty(): Schedule {
            return new Schedule({
                eventId: "",
                id: null as any,
                timeslots: []
            });
        }
    }
}