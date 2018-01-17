namespace Tccc {
    export class PastEventDetailsController {

        event: Event;
        talks: Talk[] = [];

        static $inject = ["talkApi", "eventApi", "$routeParams"];

        constructor(
            private talkApi: TalkService,
            private eventApi: EventService,
            private $routeParams: ng.route.IRouteParamsService) {
            
        }

        $onInit() {
            var rawId = this.$routeParams["id"];
            var eventId = `Events/${rawId}`;
            this.talkApi.getTalks(eventId).then(results => this.talks = results);
            this.eventApi.getEvent(eventId).then(results => this.event = results);
        }
    }

    App.controller("PastEventDetailsController", PastEventDetailsController);
}