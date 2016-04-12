namespace Tccc {
    export class PastEventDetailsController {

        event: Event;
        talks: Talk[] = [];

        static $inject = ["talkApi", "eventApi", "$routeParams"];

        constructor(talkApi: TalkService, eventApi: EventService, $routeParams: ng.route.IRouteParamsService) {
            var rawId = $routeParams["id"];
            var eventId = `Events/${rawId}`;
            talkApi.getTalks(eventId).then(results => this.talks = results);
            eventApi.getEvent(eventId).then(results => this.event = results);
        }
    }

    App.controller("PastEventDetailsController", PastEventDetailsController);
}