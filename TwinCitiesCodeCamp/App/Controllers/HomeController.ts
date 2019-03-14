namespace Tccc {
    export class HomeController {
        speakerFaces: string[] = [];
        talkTagsTotal = 0;
        talkTags: string[] = [];
        talks = new List<Talk>(() => this.talkApi.getTalksForMostRecentEvent(),
            "talks-most-recent-event",
            json => new Talk(json),
            results => this.talksLoaded(results));
        talkSlice: Talk[] = [];
        allTalksUrl: string = "";

        static $inject = [
            "talkApi"
        ];

        constructor(
            private readonly talkApi: TalkService) {
        }

        $onInit() {
            this.talks.fetch();
        }

        talksLoaded(talks: Talk[]) {
            this.speakerFaces = _.shuffle(talks)
                .map(t => t.pictureUrl)
                .filter(u => !!u);

            const allTags = this.getAllTalkTags(talks);
            this.talkTagsTotal = allTags.length;
            this.talkTags = _.shuffle(allTags)
                .slice(0, 20)
                .sort();

            this.talkSlice = _.shuffle(talks)
                .slice(0, 5);
            this.allTalksUrl = `#/${talks[0].eventId}/talks`;
        }

        getAllTalkTags(talks: Talk[]): string[] {
            return _.uniq(_.flatten(talks.map(t => t.tags)));
        }

        showAllTags() {
            this.talkTags = this.getAllTalkTags(this.talks.items).sort();
        }

        getSpeakerUrlForSpeakerFace(faceUrl: string): string {
            const talk = this.talks.items.find(t => t.pictureUrl === faceUrl);
            if (talk) {
                return `#/${talk.id}`;
            }

            return "";
        }
    }

    App.controller("HomeController", HomeController);
}