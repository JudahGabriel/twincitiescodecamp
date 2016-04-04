namespace Tccc {
    export class TalkService {

        static $inject = ["apiService"];

        constructor(private apiService: ApiService) {
        }

        get(talkId: string): ng.IPromise<Talk> {
            var args = { talkId: talkId };
            var selector = (t: Server.Talk) => new Talk(t);
            return this.apiService.query("/talks/get", args, selector);
        }

        getTalks(eventId: string): ng.IPromise<Talk[]> {
            var args = { eventId: eventId };
            var selector = (talks: Server.Talk[]) => talks.map(t => new Talk(t));
            return this.apiService.query("/talks/gettalksforevent", args, selector);
        }
    }

    App.service("talkApi", TalkService);
}