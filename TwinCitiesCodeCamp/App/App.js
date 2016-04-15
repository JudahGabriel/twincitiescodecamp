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
    function goLlamas() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.onload = function () { return window["jwerty"].key("↑,↑,↓,↓,←,→,←,→,B,A,↩", function () { return window.location.href = "https://www.youtube.com/watch?v=bHNczNvOnGc"; }); };
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jwerty/0.3.2/jwerty.min.js";
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    }
    goLlamas();
})(Tccc || (Tccc = {}));
//# sourceMappingURL=App.js.map