namespace Tccc {
    export class TalkProfileController {
        talk: Talk | null = null;

        static $inject = ["talkApi", "$sce", "$routeParams"];

        constructor(
            private talkApi: TalkService,
            $sce: ng.ISCEService,
            $routeParams: ng.route.IRouteParamsService) {

            var talkId = $routeParams["id"];
            talkApi.get("Talks/" + talkId).then(talk => {
                this.talk = talk;
                this.talk.htmlSafeAbstract = $sce.trustAsHtml(talk.abstract);
                this.talk.htmlSafeBio = $sce.trustAsHtml(talk.authorBio);
            });
        }
    }

    App.controller("TalkProfileController", TalkProfileController);
}