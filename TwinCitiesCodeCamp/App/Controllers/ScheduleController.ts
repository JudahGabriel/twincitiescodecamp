namespace Tccc {
    export class ScheduleController {
        
        event: Server.Event | null = null;
        schedule: Server.Schedule;
        talks = new List<Talk>(() => this.fetchTalks(), "talks");
        talkIdImageUrls = {};

        static $inject = [
            "eventApi",
            "scheduleApi",
            "talkApi",
            "localStorageService"
        ];
        static scheduleCacheKey = "schedule";

        constructor(
            private eventApi: EventService,
            private scheduleApi: ScheduleService,
            private talkApi: TalkService,
            private localStorageService: ng.local.storage.ILocalStorageService) {

            var cachedSchedule = localStorageService.get<Server.Schedule>(ScheduleController.scheduleCacheKey);
            if (cachedSchedule) {
                this.scheduleLoaded(cachedSchedule);
            }

            eventApi.getMostRecentEvent()
                .then(e => {
                    this.event = e;
                    this.talks.fetch();
                    scheduleApi.getScheduleForEvent(e.id)
                        .then(s => this.scheduleLoaded(s));
                });
        }

        fetchTalks(): ng.IPromise<Talk[]> {
            if (!this.event) {
                throw new Error("Event must be fetched first.");
            }

            return this.talkApi.getTalks(this.event.id);
        }

        scheduleLoaded(schedule: Server.Schedule) {
            this.schedule = schedule;
            this.schedule.timeslots.sort((a, b) => a.start > b.start ? 1 : a.start < b.start ? -1 : 0);
            this.schedule.timeslots.forEach(t => {
                t.items.sort((first, second) => first.room > second.room ? 1 : first.room < second.room ? -1 : 0);
            });
            this.localStorageService.set(ScheduleController.scheduleCacheKey, schedule);
        }

        print() {
            window.print();
        }

        getImageForScheduleItem(item: ScheduleItem): string | null {
            if (item.talkId) {
                var cached = this.talkIdImageUrls[item.talkId] as string | undefined;
                if (cached) {
                    return cached;
                }

                var talk = this.talks.items.find(t => t.id == item.talkId);
                if (talk) {
                    this.talkIdImageUrls[item.talkId] = talk.pictureUrl;
                    return talk.pictureUrl;
                } else {
                    return "../Content/Images/unknown-speaker.jpg";
                }
            }

            return null;
        }
    }

    App.controller("ScheduleController", ScheduleController);
}