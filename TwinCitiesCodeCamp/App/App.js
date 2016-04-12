var Tccc;
(function (Tccc) {
    var modules = [
        "ngRoute",
        "ngAnimate",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        "LocalStorageModule"
    ];
    Tccc.App = angular.module("TcccApp", modules);
    Tccc.App.config(["$routeProvider", function ($routeProvider) {
            $routeProvider.caseInsensitiveMatch = true;
            $routeProvider
                .when("/home", { templateUrl: "/App/Views/Home.html" })
                .when("/event", { templateUrl: "/App/Views/Event.html" })
                .when("/callforspeakers", { templateUrl: "/App/Views/CallForSpeakers.html" })
                .when("/schedule", { templateUrl: "/App/Views/Schedule.html" })
                .when("/schedule/printable", { templateUrl: "/App/Views/PrintableSchedule.html" })
                .when("/events/:eventId/talks", { templateUrl: "/App/Views/Talks.html" })
                .when("/speakers", { templateUrl: "/App/Views/Speakers.html" })
                .when("/sponsors", { templateUrl: "/App/Views/Sponsors.html" })
                .when("/pastevents", { templateUrl: "/App/Views/PastEvents.html" })
                .when("/about", { templateUrl: "/App/Views/AboutUs.html" })
                .when("/talks/:id", { templateUrl: "/App/Views/TalkProfile.html" })
                .when("/policies", { templateUrl: "/App/Views/Policies.html" })
                .otherwise({ redirectTo: "/home" });
        }]);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=App.js.map