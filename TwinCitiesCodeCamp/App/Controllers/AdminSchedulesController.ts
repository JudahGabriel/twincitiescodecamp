namespace Tccc {
    export class AdminSchedulesController {
        
        schedule: Schedule | null;
        hasLoadedSchedule = false;
        talks: Talk[] = [];
        readonly eventId: string;

        static $inject = [
            "scheduleApi",
            "talkApi",
            "$routeParams"
        ];

        constructor(
            private scheduleApi: ScheduleService,
            private talkApi: TalkService,
            private $routeParams: ng.route.IRouteParamsService) {

            const eventNumber = $routeParams["eventNumber"];
            this.eventId = `events/${eventNumber}`;
        }

        get canAddSchedule(): boolean {
            return this.hasLoadedSchedule && !this.schedule;
        }

        $onInit() {
            this.loadTalksForEvent();
            this.scheduleApi.getScheduleForEvent(this.eventId)
                .then(result => {
                    this.hasLoadedSchedule = true;
                    this.schedule = result;
                });
        }

        addSchedule() {
            if (this.hasLoadedSchedule && !this.schedule) {
                var newSched = Schedule.empty();
                newSched.eventId = this.eventId;
                this.schedule = newSched;
                this.loadTalksForEvent();
            }
        }

        loadTalksForEvent() {
            this.talkApi.getTalks(this.eventId)
                .then(results => this.talks = results.sort((a, b) => a.title.localeCompare(b.title)));
        }

        addTimeslot() {
            if (this.schedule) {
                this.schedule.timeslots.push(new ScheduleTimeslot({
                    start: 0,
                    duration: 0,
                    items: []
                }));
            }
        }

        removeTimeslot(timeslot: ScheduleTimeslot) {
            if (this.schedule) {
                _.pull(this.schedule.timeslots, timeslot);
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

        saveSchedule() {
            if (this.schedule && !this.schedule.isSaving) {
                this.schedule.isSaving = true;
                this.scheduleApi.save(this.schedule)
                    .then(result => angular.merge(this.schedule, result))
                    .finally(() => this.schedule!.isSaving = false);
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