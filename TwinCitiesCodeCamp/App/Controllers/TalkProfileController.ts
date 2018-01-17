namespace Tccc {
    export class TalkProfileController {
        talk: Talk | null = null;

        static $inject = ["talkApi", "$sce", "$routeParams"];

        constructor(
            private talkApi: TalkService,
            private $sce: ng.ISCEService,
            private $routeParams: ng.route.IRouteParamsService) {
        }

        $onInit() {
            var talkId = this.$routeParams["id"];
            this.talkApi.get("Talks/" + talkId).then(talk => {
                this.talk = talk;
                this.talk.htmlSafeAbstract = this.$sce.trustAsHtml(talk.abstract);
                this.talk.htmlSafeBio = this.$sce.trustAsHtml(talk.authorBio);
            });
        }
    }

    App.controller("TalkProfileController", TalkProfileController);
}