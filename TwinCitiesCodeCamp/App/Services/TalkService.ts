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

        getSubmission(talkSubmissionId: string): ng.IPromise<Talk> {
            const args = {
                talkSubmissionId
            };
            return this.apiService.query("/talks/getSubmission", args);
        }

        getTalks(eventId: string): ng.IPromise<Talk[]> {
            var args = { eventId: eventId };
            var selector = (talks: Server.Talk[]) => talks.map(t => new Talk(t));
            return this.apiService.query("/talks/getTalksForEvent", args, selector);
        }

        getTalksForMostRecentEvent(): ng.IPromise<Talk[]> {
            var selector = (talks: Server.Talk[]) => talks.map(t => new Talk(t));
            return this.apiService.query("/talks/getTalksForMostRecentEvent", null, selector);
        }

        submitTalk(talk: Talk): ng.IPromise<Talk> {
            return this.apiService.post("/talks/submit", talk, dto => new Talk(dto));
        }

        updateTalk(talk: Talk): ng.IPromise<Talk> {
            return this.apiService.post("/talks/update", talk, dto => new Talk(dto));
        }

        getSubmissions(eventId: string): ng.IPromise<Talk[]> {
            var args = {
                eventId: eventId
            };
            return this.apiService.query("/talks/getSubmissions", args, (dtos: Server.Talk[]) => dtos.map(d => new Talk(d)));
        }

        getMySubmissions(): ng.IPromise<Talk[]> {
            return this.apiService.query("/talks/getMySubmissions", null, (dtos: Talk[]) => dtos.map(d => new Talk(d)));
        }

        approve(talkSubmissionId: string): ng.IPromise<Talk> {
            return this.apiService.post("/talks/approve?talkSubmissionId=" + talkSubmissionId, null, dto => new Talk(dto));
        }

        reject(talkSubmissionId: string): ng.IPromise<Talk> {
            return this.apiService.post("/talks/reject?talkSubmissionId=" + talkSubmissionId, null, dto => new Talk(dto));
        }

        searchTags(search: string): ng.IPromise<string[]> {
            const args = {
                search
            };
            return this.apiService.query("/talks/searchTags", args);
        }
    }

    App.service("talkApi", TalkService);
}