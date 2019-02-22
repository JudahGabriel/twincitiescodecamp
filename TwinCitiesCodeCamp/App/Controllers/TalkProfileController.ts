namespace Tccc {
    export class TalkProfileController {
        talk: Talk | null = null;

        static $inject = [
            "talkApi",
            "currentUserId",
            "$sce",
            "$routeParams"
        ];

        constructor(
            private talkApi: TalkService,
            private currentUserId: string,
            private $sce: ng.ISCEService,
            private $routeParams: ng.route.IRouteParamsService) {
        }

        get canEditTalk(): boolean {
            if (this.talk) {
                return this.talk.submittedByUserId === this.currentUserId && !!this.currentUserId;
            }

            return false;
        }

        $onInit() {
            const talkId: string | null = this.$routeParams["id"];
            if (talkId) {
                this.talkApi.get("Talks/" + talkId)
                    .then(talk => this.processTalk(talk));
            }           
        }

        processTalk(talk: Talk) {
            this.talk = talk;
            this.talk.htmlSafeAbstract = this.$sce.trustAsHtml(talk.abstract);
            this.talk.htmlSafeBio = this.$sce.trustAsHtml(talk.authorBio);
        }
    }

    App.controller("TalkProfileController", TalkProfileController);
}