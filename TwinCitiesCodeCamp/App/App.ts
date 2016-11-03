namespace Tccc {
    var modules = [
        "ngRoute",
        "ngAnimate",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        "LocalStorageModule"
    ];

    export var App = angular.module("TcccApp", modules);
    
    App.config(["$routeProvider", function ($routeProvider: ng.route.IRouteProvider) {
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

    // Store the partials and modals as constants. These values will be cache-busted by the build. See AngularViewCacheBuster.cs
    var partials = {
        header: "/App/Views/Header.html",
    };
    App.constant("partials", partials);

    App.run([
        "partials",
        "$rootScope",
        function (partials: any, $rootScope: ng.IRootScopeService) {
            // Attach the names of the partials to the root scope so that we can refer to them in the views.
            // This allows us to bust invalidated view caches while still refering to these partials inside other views.
            for (var prop in partials) {
                $rootScope[prop] = partials[prop];
            }
        }]);
    
    function goLlamas() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.onload = () => window["jwerty"].key("↑,↑,↓,↓,←,→,←,→,B,A,↩", () => window.location.href = "https://www.youtube.com/watch?v=bHNczNvOnGc");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jwerty/0.3.2/jwerty.min.js";
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    }

    goLlamas();
}