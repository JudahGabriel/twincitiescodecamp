var Tccc;
(function (Tccc) {
    var modules = [
        "ngRoute",
        "ngAnimate",
        "ngSanitize",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        "LocalStorageModule"
    ];
    Tccc.App = angular.module("TcccApp", modules);
    Tccc.App.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
            $routeProvider.caseInsensitiveMatch = true;
            $locationProvider.hashPrefix('');
            $routeProvider
                .when("/home", { templateUrl: "/App/Views/Home.html" })
                .when("/event", { templateUrl: "/App/Views/Event.html" })
                .when("/schedule", { templateUrl: "/App/Views/Schedule.html" })
                .when("/schedule/printable", { templateUrl: "/App/Views/PrintableSchedule.html" })
                .when("/events/:eventId/talks", { templateUrl: "/App/Views/Talks.html" })
                .when("/speakers", { templateUrl: "/App/Views/Speakers.html" })
                .when("/sponsors", { templateUrl: "/App/Views/Sponsors.html" })
                .when("/sponsorship", { templateUrl: "/App/Views/SponsorshipOpportunity.html" })
                .when("/pastevents", { templateUrl: "/App/Views/PastEvents.html" })
                .when("/about", { templateUrl: "/App/Views/AboutUs.html" })
                .when("/talks/mine", { templateUrl: "/App/Views/MyTalks.html" })
                .when("/talks/:id", { templateUrl: "/App/Views/TalkProfile.html" })
                .when("/policies", { templateUrl: "/App/Views/Policies.html" })
                .when("/register/notopened", { templateUrl: "/App/Views/RegistrationNotOpened.html" })
                .when("/callforspeakers", { templateUrl: "/App/Views/SubmitTalk.html" })
                .when("/admin/talks", { templateUrl: "/App/Views/AdminTalks.html" })
                .when("/admin/sponsors", { templateUrl: "/App/Views/AdminSponsors.html" })
                .when("/admin/schedules", { templateUrl: "/App/Views/AdminSchedules.html" })
                .when("/sponsors/paypal", { templateUrl: "/App/Views/SponsorPayPal.html" })
                .otherwise({ redirectTo: "/home" });
        }]);
    // Store the partials and modals as constants. These values will be cache-busted by the build. See AngularViewCacheBuster.cs
    var partials = {
        header: "/App/Views/Header.html",
    };
    Tccc.App.constant("partials", partials);
    // Store some initialization config passedin from Razor as Angular constants for use in our controllers.
    var homeViewModel = window["Tccc.HomeViewModel"];
    if (homeViewModel) {
        Tccc.App.constant("currentUserName", homeViewModel.userName);
        Tccc.App.constant("currentUserId", homeViewModel.userId);
        Tccc.App.constant("isSignedIn", homeViewModel.isSignedIn);
        Tccc.App.constant("isUserAdmin", homeViewModel.isUserAdmin);
    }
    Tccc.App.run([
        "partials",
        "$rootScope",
        function (partials, $rootScope) {
            // Attach the names of the partials to the root scope so that we can refer to them in the views.
            // This allows us to bust invalidated view caches while still refering to these partials inside other views.
            for (var prop in partials) {
                $rootScope[prop] = partials[prop];
            }
        }
    ]);
    function goLlamas() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.onload = function () { return window["jwerty"].key("↑,↑,↓,↓,←,→,←,→,B,A,↩", function () { return window.location.href = "https://www.youtube.com/watch?v=bHNczNvOnGc"; }); };
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jwerty/0.3.2/jwerty.min.js";
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    }
    goLlamas();
    // Setup Fastclick to remove the 300ms click delay on mobile browsers.
    document.addEventListener("DOMContentLoaded", function () { return FastClick.attach(document.body); }, false);
})(Tccc || (Tccc = {}));
//# sourceMappingURL=App.js.map