namespace Tccc {
    export class HomeController {
        speakerFaces: string[] = [];
        talkTagsTotal = 0;
        talkTags: string[] = [];
        talks: Talk[] = [];
        talkSlice: Talk[] = [];
        allTalksUrl: string = "";

        static $inject = [
            "talkApi"
        ];

        constructor(
            private readonly talkApi: TalkService) {
        }

        $onInit() {
            this.talkApi.getTalksForMostRecentEvent()
                .then(talks => this.talksLoaded(talks));
        }

        talksLoaded(talks: Talk[]) {
            this.talks = talks;
            this.speakerFaces = _.shuffle(talks)
                .map(t => t.pictureUrl)
                .filter(u => !!u);

            const allTags = this.getAllTalkTags();
            this.talkTagsTotal = allTags.length;
            this.talkTags = _.shuffle(allTags)
                .slice(0, 20)
                .sort();

            this.talkSlice = _.shuffle(this.talks)
                .slice(0, 5);
            this.allTalksUrl = `#/${this.talks[0].eventId}/talks`;
        }

        getAllTalkTags(): string[] {
            return _.uniq(_.flatten(this.talks.map(t => t.tags)));
        }

        showAllTags() {
            this.talkTags = this.getAllTalkTags().sort();
        }

        getSpeakerUrlForSpeakerFace(faceUrl: string): string {
            const talk = this.talks.find(t => t.pictureUrl === faceUrl);
            if (talk) {
                return `#/${talk.id}`;
            }

            return "";
        }
    }

    App.controller("HomeController", HomeController);
}