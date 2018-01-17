namespace Tccc {
    export class AdminSchedulesController {

        schedules: Schedule[] = [];
        selectedSchedule: Schedule | null = null;
        talks: Talk[] = [];

        static $inject = [
            "scheduleApi",
            "talkApi"
        ];

        constructor(
            private scheduleApi: ScheduleService,
            private talkApi: TalkService) {
        }

        $onInit() {
            this.scheduleApi.getAll()
                .then(results => {
                    this.schedules = results;
                    this.setSelectedSchedule(results[0]);
                });
        }

        addSchedule() {
            var newSched = Schedule.empty();
            this.schedules.push(newSched);
            this.selectedSchedule = newSched;
        }

        setSelectedSchedule(schedule: Schedule | null) {
            this.selectedSchedule = schedule;
            this.talks = [];
            if (schedule) {
                this.talkApi.getTalks(schedule.eventId)
                    .then(results => {
                        if (this.selectedSchedule === schedule) {
                            this.talks = results.sort((a, b) => a.title.localeCompare(b.title));
                        }
                    });
            }
        }

        addTimeslot() {
            if (this.selectedSchedule) {
                this.selectedSchedule.timeslots.push(new ScheduleTimeslot({
                    start: 0,
                    duration: 0,
                    items: []
                }));
            }
        }

        removeTimeslot(timeslot: ScheduleTimeslot) {
            if (this.selectedSchedule) {
                _.pull(this.selectedSchedule.timeslots, timeslot);
            }
        }

        addTimeslotItem(timeslot: ScheduleTimeslot) {
            timeslot.items.push(new ScheduleItem({
                author: "",
                room: "",
                talkId: "",
                title: ""
            }));
        }

        removeTimeslotItem(item: ScheduleItem, timeslot: ScheduleTimeslot) {
            _.pull(timeslot.items, item);
        }

        saveSchedule(schedule: Schedule) {
            if (!schedule.isSaving) {
                schedule.isSaving = true;
                this.scheduleApi.save(schedule)
                    .then(result => angular.merge(schedule, result))
                    .finally(() => schedule.isSaving = false);
            }
        }

        talkSetForTimeslotItem(item: ScheduleItem) {
            if (item.talkId) {
                var talk = this.talks.find(t => t.id === item.talkId);
                if (talk) {
                    item.title = talk.title;
                    item.author = talk.author;
                }
            } 
        }
    }

    App.controller("AdminSchedulesController", AdminSchedulesController);
}